import React, {useState} from 'react';
import Sticky from 'react-stickynode';
import { Element } from 'react-scroll';
import "./conditions-and-privacy.style.scss";
import SectionTitle from "../section-title/section-title";

import {useMedia} from "../../hooks/use-media";
import {siteTermsAndServices} from "../../site-settings/site-terms-and-services";
import { Link } from 'react-scroll';

const Conditions = () => {
    const mobile = useMedia('(max-width: 580px)');
    const { title, date, content } = siteTermsAndServices;

    const menuItems: string[] = [];
    content.forEach((item) => {
        menuItems.push(item.title);
    });

    return (
        <div className="condition-privacy-wrapper">
            <SectionTitle
                titleText={title}
                subtitleText={`(Dernière modification: ${date})`}
                positionClass="left"
                spaceClass="mt-4 mb-40"
            />

            <div className="content">
                <div className="left-content">
                    <Sticky  top={mobile ? 68 : 95}  >

                        <div className="left-inner-content">
                            {menuItems.map((item: any) => (
                                <Link
                                    key={item}
                                    activeClass="active"
                                    to={item}
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </Sticky>
                </div>

                <div className="right-content">
                    {content.map((item: any, idx: number) => {
                        return (
                            <Element
                                name={item.title}
                                style={{ paddingBottom: 20 }}
                                key={idx}
                            >
                                <h2>{item.title}</h2>
                                <div
                                    className="html-content"
                                    dangerouslySetInnerHTML={{
                                        __html: item.description,
                                    }}
                                />
                            </Element>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Conditions;