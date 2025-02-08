import { inject, pageview, track } from "@vercel/analytics";
import type {
	AnalyticsProps,
	BeforeSend,
	BeforeSendEvent,
} from "@vercel/analytics";
import { createEffect, onMount } from "solid-js";

export function Analytics(
	props: AnalyticsProps & {
		framework?: string;
		route?: string | null;
		path?: string | null;
	},
): null {
	createEffect(() => {
		if (props.beforeSend) {
			window.va?.("beforeSend", props.beforeSend);
		}
	});

	onMount(() => {
		inject({
			framework: props.framework || "solid",
			...(props.route !== undefined && { disableAutoTrack: true }),
			...props,
		});
	});

	createEffect(() => {
		if (props.route && props.path) {
			pageview({ route: props.route, path: props.path });
		}
	});

	return null;
}

export { track };
export type { AnalyticsProps, BeforeSend, BeforeSendEvent };
