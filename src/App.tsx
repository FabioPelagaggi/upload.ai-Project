import { useState } from "react";
import { Button } from "./components/ui/button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
