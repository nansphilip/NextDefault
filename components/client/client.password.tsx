"use client"

import { useEffect, useState } from "react"
import { CircleCheck, CircleAlert, ChevronDown, Eye, EyeOff } from "lucide-react"
import Button from "@comps/ui/button"

export default function PasswordInputClient({ name, className, required, autoComplete, autoFocus }: {
    name: string
    className: string
    required: boolean
    autoComplete: "on" | "off"
    autoFocus?: boolean
}) {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [expanded, setExpanded] = useState(false)
    const [strength, setStrength] = useState<'Too week' | 'Better' | 'Great' | 'Almost perfect' | 'Perfect' | ''>('Too week')
    const [color, setColor] = useState('')

    useEffect(() => {
        let count = 0

        if (password.match(/[a-z]/)) count++
        if (password.match(/[A-Z]/)) count++
        if (password.match(/[0-9]/)) count++
        if (password.match(/[#?!@$ %^&*-.,:;'"_°]/)) count++
        if (password.length >= 8) count++

        switch (count) {
            case 1:
                setStrength('Too week')
                setColor('text-red-500')
                break;
            case 2:
                setStrength('Better')
                setColor('text-orange-500')
                break;
            case 3:
                setStrength('Great')
                setColor('text-yellow-500')
                break;
            case 4:
                setStrength('Almost perfect')
                setColor('text-teal-500')
                break;
            case 5:
                setStrength('Perfect')
                setColor('text-green-500')
                break;
            default:
                setStrength('Too week')
                setColor('text-red-500')
                break;
        }
    }, [password])

    return <>
        <div className="flex w-full items-center gap-1.5">
            <input
                className={`w-full max-w-fit ` + className}
                name={name}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={required}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
            />
            <Button type="button" variant="outline" buttonSize="none" className="p-1" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ?
                    <Eye size={16} className="text-gray-500 hover:text-gray-700" /> :
                    <EyeOff size={16} className="text-gray-500 hover:text-gray-700" />}
            </Button>
        </div>
        <div className={`mt-1 flex flex-col gap-1 ${password ? '' : 'hidden'}`}>
            <Button type="button" variant="transparent" buttonSize="none" ring="none" className="group flex items-center justify-between rounded-md text-sm font-medium" onClick={() => setExpanded(!expanded)}>
                <div className="text-sm font-medium">
                    <span>Strength: </span>
                    <span className={`${color}`}>{strength}</span>
                </div>
                <ChevronDown className={`group-hover:bg-gray-100 rounded-md transition duration-300 ` + (expanded ? "rotate-180" : "")} />
            </Button>
            <div className={"overflow-hidden transition-all duration-300 " + (expanded ? 'h-[100px]' : 'h-0')}>
                <Condition valid={Boolean(password.match(/[a-z]/))} condition="At least 1 lowercase letter" />
                <Condition valid={Boolean(password.match(/[A-Z]/))} condition="At least 1 uppercase letter" />
                <Condition valid={Boolean(password.match(/[0-9]/))} condition="At least 1 digit" />
                <Condition valid={Boolean(password.match(/[#?!@$ %^&*-.,:;'"_°]/))} condition="At least 1 special character" />
                <Condition valid={password.length >= 8} condition="At least 8 characters" />
            </div>
        </div>
    </>
}

const Condition = ({ valid, condition }: {
    valid: boolean,
    condition: string
}) => {
    return <div className="flex items-center gap-1">
        {valid ?
            <CircleCheck size={14} className="text-green-500" /> :
            <CircleAlert size={14} className="text-red-500" />}
        <span className={`text-sm ${valid ? 'text-green-500' : 'text-red-500'}`}>{condition}</span>
    </div>
}
