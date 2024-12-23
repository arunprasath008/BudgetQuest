import { Button } from "../ui/button"
import { Link } from "react-router-dom"
function Headers() {
  return (
    <div className="p-2 shadow-sm flex justify-between  items-center px-5">
        <div  className="flex items-center space-x-1">
        <img className="w-20" src='./budget quest logo.svg'/>
        <h4 className="text-xl font-bold">BUDGET QUEST</h4>
        </div>
        <div>
        <Link to={'/sign'}>
            <Button>Sign In</Button>
            </Link>
        </div>
    </div>
  )
}

export default Headers