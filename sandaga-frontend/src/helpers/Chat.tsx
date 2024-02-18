import {ChatProps, MessagesProps} from "../components/in-box/in-box";
import moment from "moment";
import {ChatState} from "../redux/reducers/chat.reducer";


export const groupedDays = (messages: MessagesProps[]): any => {
    return messages.reduce((acc: {[key: string]: any}, el, index) => {
        const messageDay = moment(el.createdAt).format('LL') ;
        if (acc[messageDay as string]) {
            return {...acc, [messageDay]: acc[messageDay].concat([el])}
        }
        return {...acc, [messageDay]: [el]};
    }, {});
}

export const generateItems = (messages: MessagesProps[]): any => {
    //console.log(messages)
    const days = groupedDays(messages);

    const sortedDays = Object.keys(days).sort(
        (x, y) => new Date(Number(y), Number('YYYY-MM-DD')).getMilliseconds() - new Date(Number(x), Number('YYYY-MM-DD')).getMilliseconds()
    );


    const items = sortedDays.reduce((acc: any, date) => {
        const sortedMessages = days[date].sort(
            (x: any, y: any) => new Date(x.createdAt).getMilliseconds() - new Date(y.createdAt).getMilliseconds()
        );
        return acc.concat({[date]: [...sortedMessages]});
    }, [])


    return items;
}

export const existsChat = (chats: ChatProps[], chat: ChatProps): ChatProps | null => {
    let chatLocal = null;

    chats.forEach((item, index) => {
        console.log("item: " + item.id)
        console.log("chat: " + chat.id)
        if (item.id === chat.id) {
            chatLocal = item;
        }
    })
    return chatLocal;
}

export const connected = (connexions: {owner: string; type: string}[], user?: string): boolean => {
    let connected = false;

    console.log(connexions);
    console.log(user)

    connexions.forEach((item, index) => {

        if (item.owner === user) {
            connected = true;
        }
    })
    return connected;
}