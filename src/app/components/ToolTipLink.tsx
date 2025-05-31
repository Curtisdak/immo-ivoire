
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { ReactNode } from "react"

interface TooltipLinkProps {
  tiplink:string;
  logo:ReactNode;
  linkText?:string | null;
  content:string;
}

export function TooltipLink({tiplink,logo,linkText,content}:TooltipLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link className="flex flex-col " href={tiplink}> {logo} {linkText && <p>{linkText}</p>} </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


export function TooltipCustom({logo,content}:TooltipLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
           {logo}
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

