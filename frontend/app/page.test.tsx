import { act, render, screen } from "@testing-library/react";

let subscriptionHandler: ((frame: { body: string }) => void) | undefined;

jest.mock("sockjs-client", () => jest.fn(() => ({})));

jest.mock("@stomp/stompjs", () => {
  class MockClient {
    connected = true;
    onConnect?: () => void;

    activate() {
      this.onConnect?.();
    }

    deactivate() {
      return;
    }

    subscribe(_destination: string, cb: (frame: { body: string }) => void) {
      subscriptionHandler = cb;
      return { unsubscribe: jest.fn() };
    }

    publish() {
      return;
    }
  }

  return { Client: MockClient };
});

import Home from "./page";

describe("Home", () => {
  it("renders received websocket messages", async () => {
    render(<Home />);

    await screen.findByText("Connected");

    act(() => {
      subscriptionHandler?.({
        body: JSON.stringify({ sender: "alice", content: "hello" }),
      });
    });

    expect(await screen.findByText("alice")).toBeInTheDocument();
    expect(await screen.findByText("hello")).toBeInTheDocument();
  });
});
