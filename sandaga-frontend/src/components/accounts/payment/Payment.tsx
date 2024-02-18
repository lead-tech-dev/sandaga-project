import React, {Fragment, FunctionComponent, useEffect, useRef, useState} from 'react';
import NoResult from "../../no-result/no-result";
import {create, getUserPayments} from "../../api/api-order";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import ProductPayment, {PaymentType} from "../../product/product-payment/product-payment";
import LightboxShipping from "../../lightbox/lightbox-shipping/lightbox-shipping";

interface PaymentProps {

}
const Payment: FunctionComponent<PaymentProps> = ({}) => {
    const [payments, setPayments] = useState<PaymentType[] | null >(null);
    const [currentPayment, setCurrentPayment] = useState<PaymentType | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [limit, setLimit] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [currentId, setCurrentId] = useState<string | null>(null)
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page")


    useEffect(() => {
        getUserPayments({currentPage: 1, limit: 10}).then((data) => {
            if (data.error) {
                setError(data.error)
                setPayments(null);
                setLoading(false);
            } else {
                const filter = data.payments.filter((payment: any) => payment.status !== "init")
                setPayments(filter)
                setTotalItems(data.totalItems)
                setTotalPages(data.totalPages)
                setLoading(false);
            }
        })
    }, []);

    const handleLightBox = (e: any, payment?: PaymentType) => {
        e.preventDefault();

        payment && setCurrentPayment(payment)

        const lightbox = document.querySelector(".lightbox-shipping");

        lightbox?.classList.toggle("open");
    };

    console.log(payments)
    return(
        <div className="product-payment-wrapper">
            <ul className="table-sheet payment">
                {loading ? "": payments && payments.length > 0 &&  payments? (
                    <Fragment>
                        <li>
                            <ul>
                                <li className="name">
                                    <a href="my-account-invoice.html#">
                                        Numéro  <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="data">
                                    <a href="my-account-invoice.html#">
                                        Date <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="data">
                                    <a href="my-account-invoice.html#">
                                        Type <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="data">
                                    <a href="my-account-invoice.html#">
                                        Status <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="total">
                                    <a href="my-account-invoice.html#">
                                        Montant <i className="fas fa-angle-down"></i>
                                    </a>
                                </li>
                                <li className="actions">
                                    <a href="src/components/accounts#">
                                       Action <i className="fas fa-database"></i>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        {payments.sort().map((payment, index) => {
                            return (
                                <ProductPayment  payment={payment} key={index} handleLightBox={(e, payment) => handleLightBox(e, payment)}/>
                            )
                        })}

                    </Fragment>
                ): <NoResult link="/recherche" icon="money" msg="Continuer" text="Vous n'avez pour l'instant reçu aucun paiement!"/>}
            </ul>
           {/* <div className="row">
                <div className="col-12 text-center">
                    <Pagination
                        pageCount={5}
                        nextPage={(e) => console.log(e)}
                        prevPage={(e) => console.log(e)}
                        setPage={(page) => console.log(page)}
                        currentPage={1}/>
                </div>
            </div>*/}
            <LightboxShipping handleLightBox={(e) => handleLightBox(e)} paymentProps={currentPayment} />
        </div>
    );
}

export default Payment;