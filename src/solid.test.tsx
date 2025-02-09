import { cleanup, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Analytics, type AnalyticsProps, track } from "./solid.jsx";

describe("<Analytics />", () => {
	afterEach(() => {
		cleanup();

		const html = document.getElementsByTagName("html")[0];
		if (html) {
			html.innerHTML = "";
		}
	});

	beforeEach(() => {
		window.va = undefined;
		// reset the internal queue before every test
		window.vaq = [];
	});

	describe.each([
		{
			mode: "development",
			file: "https://va.vercel-scripts.com/v1/script.debug.js",
		},
		{
			mode: "production",
			file: "http://localhost:3000/_vercel/insights/script.js",
		},
	] as { mode: Required<AnalyticsProps>["mode"]; file: string }[])(
		"in $mode mode",
		({ mode, file }) => {
			test("adds the script tag correctly", () => {
				render(() => <Analytics mode={mode} />);

				const scripts = document.getElementsByTagName("script");
				expect(scripts).toHaveLength(1);

				const script = document.head.querySelector("script");
				expect(script).toBeDefined();
				expect(script?.src).toEqual(file);
				expect(script).toHaveAttribute("defer");
			});

			test("sets and changes beforeSend", () => {
				type BeforeSend = Required<AnalyticsProps>["beforeSend"];

				const beforeSend1: BeforeSend = (event) => event;
				const beforeSend2: BeforeSend = (event) => event;

				const [beforeSend, setBeforeSend] =
					createSignal<BeforeSend>(beforeSend1);

				render(() => <Analytics beforeSend={beforeSend()} mode="production" />);

				expect(window.vaq?.[0]).toEqual(["beforeSend", beforeSend1]);
				expect(window.vaq).toHaveLength(1);
				window.vaq?.splice(0, 1);

				setBeforeSend(() => beforeSend1);
				expect(window.vaq).toHaveLength(0);

				setBeforeSend(() => beforeSend2);
				expect(window.vaq?.[0]).toEqual(["beforeSend", beforeSend2]);
				expect(window.vaq).toHaveLength(1);
			});

			test("does not change beforeSend when undefined", () => {
				type BeforeSend = Required<AnalyticsProps>["beforeSend"];

				const beforeSend1: BeforeSend = (event) => event;

				const [beforeSend, setBeforeSend] = createSignal<
					BeforeSend | undefined
				>(beforeSend1);

				render(() => <Analytics beforeSend={beforeSend()} mode="production" />);

				expect(window.vaq?.[0]).toEqual(["beforeSend", beforeSend1]);
				expect(window.vaq).toHaveLength(1);
				window.vaq?.splice(0, 1);

				setBeforeSend(() => undefined);
				expect(window.vaq).toHaveLength(0);
			});
		},
	);

	describe("track custom events", () => {
		describe("queue custom events", () => {
			test("tracks event with name only", () => {
				render(() => <Analytics mode="production" />);
				track("my event");

				expect(window.vaq?.[0]).toEqual([
					"event",
					{
						name: "my event",
					},
				]);
			});

			test("allows custom data to be tracked", () => {
				render(() => <Analytics mode="production" />);
				const name = "custom event";
				const data = { string: "string", number: 1 };
				track(name, data);

				expect(window.vaq?.[0]).toEqual(["event", { name, data }]);
			});

			test("strips data for nested objects", () => {
				render(() => <Analytics mode="production" />);
				const name = "custom event";
				const data = { string: "string", number: 1 };
				type NonUndefined<T> = T extends undefined ? never : T;
				type AllowedPropertyValues = NonUndefined<
					Parameters<typeof track>[1]
				>[string];
				track(name, {
					...data,
					nested: { object: "" } as unknown as AllowedPropertyValues,
				});

				expect(window.vaq?.[0]).toEqual(["event", { name, data }]);
			});
		});
	});
});
