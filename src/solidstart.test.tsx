import { A, Route, Router } from "@solidjs/router";
import { cleanup, render } from "@solidjs/testing-library";
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from "vitest";
import { Analytics } from "./solidstart.jsx";

describe("<Analytics />", () => {
	beforeAll(() => {
		window.scrollTo = vi.fn();
	});

	afterEach(() => {
		cleanup();

		const html = document.getElementsByTagName("html")[0];
		if (html) {
			html.innerHTML = "";
		}
	});

	beforeEach(() => {
		window.va = undefined;
		window.vaq = [];
	});

	test("should track pageview on route change", async () => {
		window.history.pushState({}, "", "/initial-route");

		const { getByTestId } = render(() => (
			<Router>
				<Route
					path="/initial-route"
					component={() => (
						<>
							<Analytics />
							<A data-testid="navigate-link" href="/other-route">
								/other-route
							</A>
						</>
					)}
				/>
				<Route
					path="/other-route"
					component={() => (
						<>
							<Analytics />
							<A data-testid="navigate-link" href="/route-with-params/smith">
								/route-with-params/smith
							</A>
						</>
					)}
				/>
				<Route
					path="/route-with-params/:name"
					component={() => (
						<>
							<Analytics />
							<A data-testid="navigate-link" href="/initial-route">
								/test-route
							</A>
						</>
					)}
				/>
			</Router>
		));

		expect(window.vaq).toHaveLength(1);
		expect(window.vaq?.at?.(-1)?.[0]).toEqual("pageview");
		expect(window.vaq?.at?.(-1)?.[1]).toEqual({
			route: "/initial-route",
			path: "/initial-route",
		});

		await getByTestId("navigate-link").click();

		expect(window.vaq).toHaveLength(2);
		expect(window.vaq?.at?.(-1)?.[0]).toEqual("pageview");
		expect(window.vaq?.at?.(-1)?.[1]).toEqual({
			route: "/other-route",
			path: "/other-route",
		});

		await getByTestId("navigate-link").click();

		expect(window.vaq).toHaveLength(3);
		expect(window.vaq?.at?.(-1)?.[0]).toEqual("pageview");
		expect(window.vaq?.at?.(-1)?.[1]).toEqual({
			route: "/route-with-params/[name]",
			path: "/route-with-params/smith",
		});
	});
});
