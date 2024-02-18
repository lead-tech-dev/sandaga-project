import React from "react";
import {Link, useNavigate} from "react-router-dom";

const Conversation = () => {
    const navigate = useNavigate();
    return (
        <div className="account-listing">
            <div className="conversation">
                <div className="title">
                    <div className="row justify-content-center align-self-center h-100">
                        <div className="col-12 col-md-6 my-auto d-md-none">
                            <Link to="/dashboard/mes-messages" className="btn btn-primary">
                                <i className="fas fa-angle-double-left"></i> Back
                            </Link>
                            <a href="@#" className="btn btn-default">
                                <i className="fas fa-archive"></i> Archive
                            </a>
                        </div>
                        <div className="col-12 col-md-6 my-auto">
                            <span className="name">BMW Series 5 2018</span>
                        </div>
                        <div className="col-12 col-md-6 my-auto d-none d-md-block">
                            <div className="text-right">
                                <Link to="/dashboard/mes-messages" className="btn btn-primary">
                                    <i className="fa fa-angle-double-left"></i> Back
                                </Link>
                                <a href="my-account-inbox.html" className="btn btn-default">
                                    <i className="fa fa-archive"></i> Archive
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="item client">
                    <div className="message">
                        Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry.
                        <br />
                        Lorem Ipsum has been the industry's standard dummy text ever since
                        the 1500s, when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book.
                        <br />
                        It has survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        <br />
                        It was popularised in the 1960s with the release of Letraset sheets
                        containing Lorem Ipsum passages, and more recently with desktop
                        publishing software like Aldus PageMaker including versions of Lorem
                        Ipsum.
                    </div>
                    <div className="infos">
            <span>
              <i className="fa fa-user" aria-hidden="true"></i> John Doe
            </span>
                        <span>
              <i className="fa fa-clock" aria-hidden="true"></i> Sep 25, 2017,
              3:41 PM
            </span>
                        <span>
              <a href="my-account-conversation.html#">
                <i className="fa fa-lock" aria-hidden="true"></i> Block user
              </a>
            </span>
                    </div>

                    <div className="item owner">
                        <div className="message">
                            Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry.
                            <br />
                            Lorem Ipsum has been the industry's standard dummy text ever since
                            the 1500s, when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book.
                            <br />
                            It has survived not only five centuries, but also the leap into
                            electronic typesetting, remaining essentially unchanged.
                            <br />
                            It was popularised in the 1960s with the release of Letraset
                            sheets containing Lorem Ipsum passages, and more recently with
                            desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </div>
                        <div className="infos">
              <span>
                <i className="fa fa-clock" aria-hidden="true"></i> Sep 25, 2017,
                3:41 PM
              </span>
                        </div>
                    </div>
                    <form action="src/components/accounts#" method="post">
                        <div className="row justify-content-center">
                            <div className="col-12 mb-15">
                                <div className="form-group">
                  <textarea
                      className="form-control"
                      placeholder="Message"
                  ></textarea>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-5">
                                <button className="btn btn-primary" type="button">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Conversation;
