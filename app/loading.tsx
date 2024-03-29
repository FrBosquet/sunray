import { BsSunFill } from "react-icons/bs";

export default function Loading() {
  return <div className="flex justify-center items-center w-screen h-screen">
    <BsSunFill className="animate-spin text-yellow-300 text-2xl" />
  </div>
}
