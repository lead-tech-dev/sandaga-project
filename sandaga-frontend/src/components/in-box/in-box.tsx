import React, {Fragment, FunctionComponent, RefObject, useEffect, useRef, useState} from 'react';
import "./in-box.style.scss"
import {
    ADS_IMAGE_URL,
    CHAT_URL,
    headersWithAuthorization,
    MESSAGE_URL
} from "../../hooks/useConfig";
import moment from "moment";
import 'moment/locale/fr'
import {useNavigate, useParams} from "react-router-dom";
import {convertCriteria, getCategoryCriteria} from "../../helpers/Poster";
import {criteriaData} from "../../data/data";
import {State} from "../../redux/types";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import NoResult from "../no-result/no-result";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {AuthActionTypes} from "../../redux/types/auth.type";
import {connected, existsChat, generateItems, groupedDays} from "../../helpers/Chat";
import Read from "../../assets/icons/Read";
import {ArrowLeftRound, ArrowPrev} from "../../assets/icons/AllSvgIcon";
import ArrowRight from "../../assets/icons/ArrowRight";
import Loading from "../loading/loading";
import {LazyLoadImage} from "react-lazy-load-image-component";
export interface ChatProps {
    id: string;
    message: {
        message: string;
        createdAt: Date;
    },
    ads: {
        subject?: string;
        imageName?: string;
        status?: string
    },
    sender: {
        firstName: string;
    },
    pendingMessageNumber: number
    active?: boolean
}
export interface MessagesProps {
    id?: string;
    chatId?: string;
    ads?: string;
    receiver: string;
    sender: string;
    owner: string;
    dest: string;
    message: string;
    status?: string;
    createdAt?: Date
}
export interface DataMessageProps {
    message: MessagesProps[],
    ads: {
        id: string,
        subject: string,
        body: string,
        createdAt: Date,
        price_cents: number,
        imageName: string,
        status: string,
        criteria: {[key: string]: string}
        category: any;
    },
    sender: {
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        image?: string;
        address: {
            id: string;
            number: string;
            street: string;
            city: string;
            state: string;
            country: string;
            pincode: string;
        },
        reviews: {
            count: number,
            average: number
        }
        connectionStatus: string;
    },
    status: string;
}
interface InBoxInterface {
    id?: string
}
const InBox: FunctionComponent<InBoxInterface & InBoxProps> = ({auth: {credentials}, id}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [messageLoading, setMessageLoading] = useState<boolean>(true);
    const [chats, setChats] = useState<ChatProps[]>([])
    const [messages, setMessages] = useState<DataMessageProps | null>(null);
    const [formData, setFormData] = useState<MessagesProps>({ads: "", chatId: "", receiver: "", sender: "", dest: "", owner: "", status: "", message: ""});
    const [error, setError] = useState<string | null>(null);
    const [stompClient, setStompClient] = useState<any>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState<boolean>(true)
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false)
    const [connexion, setConnexion] = useState<{owner: string; type: string} | null>(null)
    const [sending, setSending] = useState<string | null>(null);
    const [receiveChat, setReceiveChat] = useState<ChatProps | null>(null);
    const [updateMessages, setUpdateMessages] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);
    const count1 = useRef(0);
    const chatRef = useRef<any>(null);
    moment.locale('fr')

    useEffect(() => {
        if (messages && updateMessages && updateMessages.chatId === id) {
           let filter = messages?.message.filter(item => item.status !== "pending");

           setMessages((prevState) => prevState && ({...prevState, message: [...updateMessages.messages, ...filter]}))
           setUpdateMessages(null);
        }

    }, [updateMessages]);

    useEffect(() => {
        if (connexion) {
            setMessages((prevState) => prevState && ({...prevState, sender: {...prevState?.sender, connectionStatus: connexion.type}}))
        }
    }, [connexion]);

    useEffect(() => {
        if (receiveChat) {
            const chat = chats.filter(item => item.id === receiveChat.id);

            if (chats.length === 0) {
                setChats((prevState) => [{...receiveChat, pendingMessageNumber: 0}, ...prevState])
                navigate(`/dashboard/mes-messages/${receiveChat.id}`)
            }else if (chats.length === 1 && chat.length === 0) {
                setChats((prevState) => [{...receiveChat, pendingMessageNumber: 1}, ...prevState])
                dispatch({
                    type: AuthActionTypes.ADD_PENDING_MESSAGE_NUMBER,
                    nbr: 1
                })
            } else if (chats.length === 1 && chat.length !== 0) {
                let filter = chats.filter(item => item.id !== receiveChat.id);
                chat[0].message = receiveChat.message;
                chat[0].pendingMessageNumber = 0;
                setChats([...chat, ...filter]);

                dispatch({
                    type: AuthActionTypes.INIT_PENDING_MESSAGE_NUMBER,
                    nbr: 0
                })
            } else if (chats.length > 1 && chat.length === 0){
                setChats((prevState) => [{...receiveChat, pendingMessageNumber: 1}, ...prevState])
                dispatch({
                    type: AuthActionTypes.ADD_PENDING_MESSAGE_NUMBER,
                    nbr: 1
                })
            }else {
                if (receiveChat.id !== id) {
                    let filter = chats.filter(item => item.id !== receiveChat.id);
                    chat[0].message = receiveChat.message;
                    chat[0].pendingMessageNumber = chat[0].pendingMessageNumber + 1;
                    setChats([...chat, ...filter]);

                    dispatch({
                        type: AuthActionTypes.ADD_PENDING_MESSAGE_NUMBER,
                        nbr: 1
                    })
                }else {
                    let filter = chats.filter(item => item.id !== receiveChat.id);
                    chat[0].message = receiveChat.message;
                    chat[0].pendingMessageNumber = 0;
                    setChats([...chat, ...filter]);
                    let message: MessagesProps = {id: "", message: receiveChat.message.message, chatId: "", owner: "", sender: "", status: "", createdAt: receiveChat.message.createdAt, dest: credentials && credentials["userId"], receiver: "", ads: ""}
                    //setMessages((prevState) => prevState && ({...prevState, message: [message, ...prevState.message]}))
                    dispatch({
                        type: AuthActionTypes.INIT_PENDING_MESSAGE_NUMBER,
                    })
                }
            }
        }
    }, [receiveChat]);

    useEffect(() => {
      if (chatRef.current) {
          chatRef.current.scrollIntoView({behavior: 'smooth', block: "end", inline: "nearest"})
      }
    });

    useEffect(() => {
        if (count1.current === 0) {
            chatApiCall();
        }
        count1.current++;
    }, []);

    useEffect(() => {
        if (id) {
            chatMessageApiCall(id)
        }
    }, [id]);

    useEffect(() => {

        const socket = new SockJS('http://localhost:8080/api/v1/ws');
        const client = Stomp.over(socket);


        client.connect({}, () => onConnected(client), onError)


        setStompClient(client)


        return () => {
            credentials && client.send('/app/chat.disconnect', {}, credentials["userId"]);

            setTimeout(() => {
                console.log("disconect");
                client.disconnect(() => {});
            }, 1000)

        }
    }, [])

    const onConnected = async (client: any) => {
        client.subscribe('/topic/public', (message: any) => {

            console.log(message)
            const receiveMessage = JSON.parse(message.body);


            if (receiveMessage.type === "UPDATE") {
                setUpdateMessages(receiveMessage)
            }

            if (receiveMessage.type === "CREATE") {
              setReceiveChat(receiveMessage);
            }

          /*  if (credentials && (receiveMessage.type === "INIT" && receiveMessage.dest === credentials["userId"] && receiveMessage.chatId !== id)) {
                setReceiveChat((prevState: any) => ({...prevState, id: receiveMessage.chatId, message: {message: receiveMessage.message, createdAt: receiveMessage.createdAt}}))
            }*/


            if (credentials && credentials["userId"] !== receiveMessage.owner && (receiveMessage.type === "ONLINE" || receiveMessage.type === "OFFLINE")) {
                setConnexion(receiveMessage)
            }

            console.log(receiveMessage)
            if (credentials && (receiveMessage.type === "CHAT" && (receiveMessage.owner === credentials["userId"] || receiveMessage.dest === credentials["userId"]) && receiveMessage.chatId === id)) {
                //setReceiveChat((prevState: any) => ({...prevState, id: receiveMessage.chatId, message: {message: receiveMessage.message, createdAt: receiveMessage.createdAt}}))
                setMessages((prevState: any) => ({...prevState, message: [receiveMessage, ...prevState.message]}))
                setSending(null)
            }
        })

        credentials && client.send("/app/chat.connect",
            {},
            credentials["userId"]
        );
        setError(null);
    }
    const onError = async (err: any) => {
        console.log(err);
        setError("Connexion perdue. Veuillez actualiser cette page et réessayer !");

       // setTimeout(() => onConnected(stompClient), 5000)
    }

    const chatApiCall = () => {
        setLoading(true);
        fetch(CHAT_URL,{
            method: "GET",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    if (json.length > 0) {
                        json[0].active = true
                        dispatch({
                            type: AuthActionTypes.REMOVE_PENDING_MESSAGE_NUMBER,
                            nbr: json[0].pendingMessageNumber
                        })
                        json[0].pendingMessageNumber = 0;

                        navigate(`/dashboard/mes-messages/${json[0].id}`)
                    }
                    setChats(json)
                    setLoading(false)
                }else {

                    setChats([])
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });

    }
    const deleteChatApiCall = (chatId: string) => {
        fetch(CHAT_URL + "/" + chatId,{
            method: "DELETE",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setDeleteLoading(false)
                    setDeleteSuccess(true)
                    //chatApiCall();
                    let filterChars = chats?.filter(item => item.id !== chatId);
                    filterChars && setChats(filterChars)
                }else {
                    setDeleteLoading(false)
                    setDeleteSuccess(false)
                }
            })
            .catch((err) => {
                setDeleteLoading(false)
                console.log(err);
            });

    }
    const chatMessageApiCall = (id: string) => {
        setMessageLoading(true);
        fetch(MESSAGE_URL + "/" + id,{
            method: "GET",
            mode: "cors",
            headers: {
                ...headersWithAuthorization(),
            }
        })
            .then((response) => Promise.all([response, response.json()]))
            .then(([response, json]) => {

                if (response.ok){
                    setMessages(json)
                    setMessageLoading(false)
                }else {

                    setMessages(null)
                    setMessageLoading(false)
                }
            })
            .catch((err) => {
                setMessageLoading(false)
                console.log(err);
            });

    }
    const handleChatMessage = (id: string) => {
        navigate(`/dashboard/mes-messages/${id}`, {replace: true});
        let localChat = chats;
        localChat && localChat.forEach(item => {
            if (item.id === id) {
                item.active = true;
                dispatch({
                    type: AuthActionTypes.REMOVE_PENDING_MESSAGE_NUMBER,
                    nbr: item.pendingMessageNumber
                })
                item.pendingMessageNumber = 0;
            }else {
                item.active = false
            }
        })
        setOpen(!open)

        setChats(localChat);
    }

    const handleChange = (e: any) => {
        setFormData((prevState) => ({...prevState, message: e.target.value}))
    }

    const handleDeleteChat = (e: any, chatId: string) => {
        e.preventDefault();

        if (e.target.localName === "i") {
            deleteChatApiCall(chatId)
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        //messages && console.log({ads: messages?.ads.id, receiver: messages?.message[0].receiver, sender: messages.message[0].sender, message: formData.message})
        try {
            let data = credentials && messages && {ads: messages?.ads.id, receiver: messages?.message[0].receiver, sender: messages.message[0].sender, owner: credentials["userId"], dest: messages.sender.id, message: formData.message};
            stompClient.send('/app/chat', {}, JSON.stringify(data))
            //credentials && messages &&  createChat({ads: messages?.ads.id, receiver: messages?.message[0].receiver, sender: messages.message[0].sender, owner: credentials["userId"], dest: messages.sender.id, message: formData.message})
            setSending(formData.message)
            setFormData((prevState) => ({...prevState, message: ""}));
        } catch(err){
            console.log(err);
        }
    }

    const handleOpen = () => {
        setOpen(!open)
    }

    return(
        <Fragment>
            {loading ? "" : chats && chats?.length > 0 ?  <div id={`container`}>
                <aside className={`left ${!open ? "close" : "open"}`}>
                    <ul>
                        {chats.length > 0 && chats.map((item, index) => {
                            return(
                                <li onClick={() => handleChatMessage(item.id)} key={index} className={`${item.active ? "active" : ""}`}>
                                    <i className="fa fa-trash" onClick={(e) => handleDeleteChat(e, item.id)}></i>
                                    {item.pendingMessageNumber !== 0 && <span className="number">{item.pendingMessageNumber}</span>}
                                    <img src={item.ads.imageName || item.ads.status && item.ads.status !== "delete" ? ADS_IMAGE_URL + item.ads.imageName : "/assets/images/products/default-product.png"} alt=""/>
                                    <div>
                                        <h2>{item.ads.subject && item.ads.subject.length > 17 ? item.ads.subject.substring(0, 17) + "..." : item.ads.subject}</h2>
                                        <h3 className="message">
                                            {item.ads.status && item.ads.status === "delete" ? "Annonce supprimée" : item.message.message.length > 17 ? item.message.message.substring(0, 17) + "..." : item.message.message}
                                        </h3>
                                        <h3 className="date">
                                            {item.sender.firstName} - {moment(item.message.createdAt).format('ll')}
                                        </h3>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </aside>
                <main className={` ${!open ? "open" : "close"}`}>
                    <div className="content">
                        <header>
                            <div>
                                <h2>À propos de {messages?.status === "Acheteur" ? "cet acheteur" : "ce vendeur"} </h2>
                                {messages?.sender.address && <h3><i className="fa fa-map-marker"/> {messages?.sender.address.city}</h3>}
                                <h3><i className="fa fa-user"/>Membre depuis le {moment(messages?.sender.createdAt).format('ll')}</h3>
                            </div>

                        </header>
                        {
                            messageLoading ? "...loading" : (
                                <ul id="chat">
                                    {messages && Object.keys(groupedDays(messages.message)).reverse().map((el: any, index: number) => {

                                        return (
                                            <Fragment>
                                               <li className="group" key={index}><span>{el}</span></li>
                                                {groupedDays(messages.message)[el].reverse().map((item: any, i: number) => (
                                                    <li  className={`${credentials && item.owner !== credentials["userId"] ? "you" : "me"}`} key={i}>
                                                        <div className="entete">
                                                            <span className={`status ${credentials && item.owner !== credentials["userId"] ? "green" : "blue"}`}></span>
                                                            {/*<h2>Vincent</h2>*/}
                                                            <h3>{moment(item.createdAt).format('LT')} {
                                                                item.owner === credentials["userId"] && item.status === "read" ? <><span className="dot"/> <Read color="primary"/></> :
                                                                    item.owner === credentials["userId"] && item.status === "pending" ? <><span className="dot"/> <Read color="secondary"/> </> : ""
                                                            }
                                                            </h3>
                                                        </div>
                                                        <div className="message">
                                                            <div className="triangle"></div>
                                                            {item.message}
                                                        </div>
                                                    </li>
                                                ))}
                                            </Fragment>
                                        )

                                    })}
                                    {sending && (
                                        <li  className="me">
                                            <div className="entete">
                                                <span className="blue"></span>
                                                <h3><Loading/></h3>
                                            </div>
                                            <div className="message">
                                                <div className="triangle"></div>
                                                {sending}
                                            </div>
                                        </li>
                                    )}
                                    {error && (
                                        <li  className="me" style={{fontSize: "12px", color: "red"}}>{error}</li>
                                    )}
                                    <div ref={chatRef}/>
                                </ul>
                            )
                        }
                    </div>
                    <footer>
                        <form onSubmit={handleSubmit}>
                            <textarea placeholder="Entrez votre message" onChange={handleChange} value={formData.message}></textarea>
                            <button
                                type="submit"
                                className="btn btn-primary full-width"
                                disabled={formData && formData.message === "" || loading || error !== null || messages?.ads.status === "delete"}
                            >
                                Envoyer
                            </button>
                        </form>
                    </footer>
                </main>
                <aside className={`right ${!open ? "open" : "close"}`}>
                    <header onClick={handleOpen}>
                        <ArrowLeftRound />
                       {/* <LazyLoadImage
                            effect="blur"
                            width={335} height={325}
                            className="img"
                            src={ADS_IMAGE_URL + messages?.sender.image}
                            alt=""
                        />*/}

                        <img src={messages?.sender.image ? ADS_IMAGE_URL + messages?.sender.image : "/assets/images/svg/avatar.svg"} alt=""/>
                        <div className="info">
                            <h2>{messages?.sender.firstName}</h2>
                            {messages?.sender.connectionStatus === "ONLINE" ? (
                                <>
                                    <span className="online"></span><span className="text">en ligne</span>
                                </>
                            ) : (
                                <>
                                    <span className="offline"></span><span className="text">hors ligne</span>
                                </>
                            )}
                            {messages?.sender.reviews.count && messages?.sender.reviews.count !== 0 ? <h3>{messages?.sender.reviews.count} avis</h3> : ""}
                        </div>
                    </header>

                    <ul>
                        <li className="product">
                            <img src={messages?.ads.imageName || messages?.ads.status !== "delete"  ? ADS_IMAGE_URL + messages?.ads.imageName : "/assets/images/products/default-product.png"}  alt=""/>
                            <div>
                                <h2>{messages?.ads.subject.length && messages?.ads.subject.length > 23 ? messages?.ads.subject.substring(0, 23) + "..." : messages?.ads.subject}</h2>
                                <h3>
                                    { messages?.ads.status !== "delete" ? messages && messages.ads.price_cents > 0 && messages?.ads.price_cents + "€" : "Annonce supprimée"}
                                </h3>
                                {messages?.ads.status === "sold" && <span className="status">Article vendu</span>}
                            </div>
                        </li>

                        {
                            messages?.ads.status !== "delete" && (
                                <>
                                    <li className="description">
                                        <div>
                                            <h2>Description</h2>
                                            <h3>
                                                {messages?.ads.body}
                                            </h3>
                                        </div>
                                    </li>

                                    {messages?.ads && Object.keys(convertCriteria(messages?.ads.criteria, getCategoryCriteria(criteriaData, messages?.ads.category))).length > 0 && (
                                        <li className="criteria">
                                            <div>
                                                <h2>Critères</h2>
                                                {messages?.ads && Object.keys(convertCriteria(messages?.ads.criteria, getCategoryCriteria(criteriaData, messages?.ads.category))).map((item, index) => {
                                                    return (
                                                        <div className="item" key={index}>
                                                            <p>{item}: </p>
                                                            <p>{convertCriteria(messages?.ads.criteria, getCategoryCriteria(criteriaData, messages?.ads.category))[item]}</p>
                                                        </div>
                                                    )
                                                })}


                                            </div>
                                        </li>
                                    )}
                                </>
                            )
                        }

                    </ul>
                </aside>
            </div> : <NoResult link="/recherche" icon="comments" msg="Continuer" text="Vous n'avez pour l'instant reçu aucun message!"/>}
        </Fragment>

    );
}

const mapStateToProps = (state: State) => ({
    auth: state.auth
});




const connector = connect(mapStateToProps, null);

type InBoxProps = ConnectedProps<typeof connector>;

export default connector(InBox);