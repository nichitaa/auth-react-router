import { useState } from 'react';

export const ReRenderer = () => {
  const [s, setS] = useState(0)
  return <button onClick={() => setS((prev) => prev + 1)}>rerender {s}</button>
}