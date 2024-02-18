import {FunctionComponent, ReactElement, useEffect} from "react";

interface ScrollToTopProps {
    children: ReactElement
}
const ScrollToTop: FunctionComponent<ScrollToTopProps> = ({children}) => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
    return children;
};

export default ScrollToTop;