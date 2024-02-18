import React, {FunctionComponent} from 'react';
interface ReadProps {
    color: string;
}
const Read:FunctionComponent<ReadProps> = ({color}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="20" height="20" x="0" y="0" viewBox="0 0 4000 4000"
            className={color}><g><g fill="#1e2959"><path d="M2682.773 1372.227c-42.969-42.969-112.632-42.969-155.547 0L1505 2394.453l-582.227-582.227c-42.915-42.969-112.632-42.969-155.547 0-42.969 42.969-42.969 112.578 0 155.547l660 660c21.484 21.484 49.629 32.227 77.773 32.227s56.289-10.742 77.773-32.227l1100-1100c42.97-42.915 42.97-112.578.001-155.546zM3077.227 1372.227l-1100 1100c-42.969 42.969-42.969 112.578 0 155.547 21.484 21.484 49.629 32.227 77.773 32.227s56.289-10.742 77.773-32.227l1100-1100c42.969-42.969 42.969-112.578 0-155.547-42.915-42.969-112.631-42.969-155.546 0z" fill="#1e2959" opacity="1" data-original="#1e2959" className=""></path></g></g></svg>
    );
};

export default Read;