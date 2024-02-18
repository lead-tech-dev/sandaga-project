import {FunctionComponent, ReactElement, useEffect} from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopInterface {
    children: ReactElement
}
const  ScrollToTop: FunctionComponent<ScrollToTopInterface> = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
}

export default ScrollToTop