import { BsSunFill } from "react-icons/bs";

export default function Loading() {
  return <div className="flex justify-center items-center w-full h-full min-h-[80vh]">
    <BsSunFill className="animate-spin text-yellow-300 text-2xl" />
  </div>
}
