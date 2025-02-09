import { useLocation, useParams } from "@solidjs/router";
import { computeRoute, track } from "@vercel/analytics";
import type {
	AnalyticsProps,
	BeforeSend,
	BeforeSendEvent,
} from "@vercel/analytics";
import type { JSX } from "solid-js";
import { type Accessor, createMemo } from "solid-js";
import { Analytics as AnalyticsScript } from "./solid.jsx";

type Props = Omit<AnalyticsProps, "route" | "disableAutoTrack">;

export function Analytics(props: Props): JSX.Element {
	const route = useRoute();
	return (
		<AnalyticsScript
			path={route().path}
			route={route().route}
			{...props}
			framework="solidstart"
		/>
	);
}

const useRoute = (): Accessor<{
	route: string | null;
	path: string;
}> => {
	const location = useLocation();
	const params = useParams();

	return createMemo(() => {
		if (!params) {
			return { route: null, path: location.pathname };
		}

		return {
			route: computeRoute(location.pathname, params),
			path: location.pathname,
		};
	});
};

export { track };
export type { AnalyticsProps, BeforeSend, BeforeSendEvent };
