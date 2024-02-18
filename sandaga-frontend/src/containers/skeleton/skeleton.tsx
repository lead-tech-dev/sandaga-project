import React, {Fragment, FunctionComponent} from 'react';
import SkeletonOne from "../../components/skeleton/skeleton";

interface SkeletonProps {
    size: number;
}
const Skeleton: FunctionComponent<SkeletonProps> = ({ size }) => {
    return (
        <Fragment>
            {
                Array.from({ length: size }, (_, k) => k).map((_, index) => (
                    <SkeletonOne key={index}/>
                ))
            }
        </Fragment>
    )
};

export default Skeleton;