
import {render, screen} from "@testing-library/react";
import Notification from "./notification"
import user from "@testing-library/user-event";
import React from "react";
import {mockServer} from "../../mock/servers";
import Dashboard from "../accounts/dashboard/dashboard";

beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())

test("NotificationBtn, when click call handleDeleteNotification fn", () => {

    const fakeData = {
        id: "1",
        message: "Vous avez reçu un message",
        createdAt: new Date(),
        status: "pending"
    }

    const mockDeleteButton = jest.fn();
    render(<Notification notification={fakeData} handleDeleteNotification={mockDeleteButton}/>);

    //const e: MouseEvent = new MouseEvent("onclick")
    const deleteButton = screen.getByTestId("button");
    user.click(deleteButton);

    expect(mockDeleteButton).toBeCalled();
    expect(mockDeleteButton).toBeCalledTimes(1);

    //expect(mockDeleteButton).toBeCalledWith(e, "1");
    //screen.debug(deleteButton);
})

test("Dashboard, when component mount display user notifications", () => {
    // Given
    render(
        <Dashboard/>
    );

    // When
    // Then
    const firstMessage = screen.getByText("Vous avez reçu un message 1");
    const secondMessage = screen.getByText("Vous avez reçu un message 2");

    expect(firstMessage).toBeInTheDocument();
    expect(secondMessage).toBeInTheDocument();
})