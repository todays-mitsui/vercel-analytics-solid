# Vercel Analytics Solid

Vercel Analytics Solid is a project that integrates Vercel Analytics with SolidJS or SolidStart.

## Features

see: https://vercel.com/docs/analytics/package

## Installation

To install the package, run:

```bash
npm install vercel-analytics-solid
```

## Usage

Add the `Analytics` component to your app

### SolidJS project

```jsx
import { Analytics } from 'vercel-analytics-solid';

export default function App() {
  return (
    <>
      <Analytics path={PAGE_PATH} mode="development" />
      {/* Your Project Code... */}
    </>
  );
}
```

### SolidStart Project

in `src/app.tsx`:

```jsx
import { Analytics } from 'vercel-analytics-solid/solidstart';

export default function App() {
  return (
    <Router>
      <FileRoutes />
      <Analytics />
    </Router>
  );
}

```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please open an issue on GitHub.
