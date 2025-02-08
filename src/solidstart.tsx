import { useLocation, useParams } from "@solidjs/router";
import { computeRoute, track } from "@vercel/analytics";
import type {
	AnalyticsProps,
	BeforeSend,
	BeforeSendEvent,
} from "@vercel/analytics";
import type { JSX } from "solid-js";
import { Analytics as AnalyticsScript } from "./solid";

type Props = Omit<AnalyticsProps, "route" | "disableAutoTrack">;

export function Analytics(props: Props): JSX.Element {
	const { route, path } = useRoute();
	return (
		<AnalyticsScript
			path={path}
			route={route}
			{...props}
			framework="solidstart"
		/>
	);
}

export const useRoute = (): {
	route: string | null;
	path: string;
} => {
	const params = useParams();
	const location = useLocation();

	if (!params) {
		return { route: null, path: location.pathname };
	}

	return {
		route: computeRoute(location.pathname, params),
		path: location.pathname,
	};
};

export { track };
export type { AnalyticsProps, BeforeSend, BeforeSendEvent };
