import { cleanup, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Analytics, type AnalyticsProps } from "./solid";

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
				const beforeSend1: Required<AnalyticsProps>["beforeSend"] = (event) =>
					event;
				const beforeSend2: Required<AnalyticsProps>["beforeSend"] = (event) =>
					event;

				const [beforeSend, setBeforeSend] =
					createSignal<Required<AnalyticsProps>["beforeSend"]>(beforeSend1);

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
				const beforeSend1: Required<AnalyticsProps>["beforeSend"] = (event) =>
					event;

				const [beforeSend, setBeforeSend] =
					createSignal<Required<AnalyticsProps>["beforeSend"]>(beforeSend1);

				render(() => <Analytics beforeSend={beforeSend()} mode="production" />);

				expect(window.vaq?.[0]).toEqual(["beforeSend", beforeSend1]);
				expect(window.vaq).toHaveLength(1);
				window.vaq?.splice(0, 1);

				setBeforeSend(() => undefined);
				expect(window.vaq).toHaveLength(0);
			});
		},
	);
});
