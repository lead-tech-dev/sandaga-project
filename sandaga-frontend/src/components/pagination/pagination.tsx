import React, {FunctionComponent, useEffect, useState} from 'react';
import "./pagination.style.scss";
import classNames from "classnames";
import {ArrowNext, ArrowPrev} from "../../assets/icons/AllSvgIcon";

interface PaginationProps {
    pageCount: number;
    currentPage: number;
    setPage: (page: number) => void;
    prevPage: (e: any) => void;
    nextPage: (e: any) => void;
}
const Pagination: FunctionComponent<PaginationProps> = ({pageCount, prevPage, nextPage, setPage, currentPage}) => {
    const [range, setRange] = useState<number[]>([])

    useEffect(() => {
        let localArray = []

        if (pageCount) {
            for (let i = 1; i <= pageCount; i++) {
                localArray.push(i)
            }
        }

        setRange(localArray);

    }, [pageCount])

    return(
        <ul className="pagination">
            <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
                <a className="page-link text-center" onClick={(e) => prevPage(e)}>
                    <ArrowPrev />
                </a>
            </li>

            {
                range.map(page => {
                    const onClick = () => {
                        setPage(page)
                    };

                    return(
                        <li className={`page-link ${classNames({active: String(currentPage) === String(page)})}`} key={page}>
                            <a  onClick={onClick}>
                                {page}
                            </a>
                        </li>
                    )
                })
            }

            <li className={`page-item next ${currentPage === pageCount ? "disabled" : ""}`}>
                <a className="page-link text-center" onClick={(e) => nextPage(e)}>
                    <ArrowNext />
                </a>
            </li>
        </ul>
    )
};

export default Pagination;