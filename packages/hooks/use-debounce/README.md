# `useDebounce` React Hook

Implement a React hook to debounce (delay) the call of a function. It's really helpful when combined with a text input.

## Installation

1. Add `@bsport/use-debounce` to your project dependencies :

   ```json
   {
     "dependencies": {
       "@bsport/use-debounce": "workspace:*"
       // other dependencies...
     }
   }
   ```

2. Import the hook, and provide the action to debounce, and the delay.

   ```tsx
   import { useDebounce } from "@bsport/use-debounce";

   const MyPage = () => {
     const [searchInput, setSearchInput] = useState("");

     const updateSearchInput = useDebounce(setSearchInput, 1000);

     // In this example, we debounce the update of searchInput (one per second),
     // To make a fetch with the debounced updated searchInput
     useEffect(() => {
       fetch("...", { q: searchInput });
     }, [searchInput]);

     return <TextField value={searchInput} onChange={updateSearchInput} />;
   };
   ```
