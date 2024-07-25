export default function Loader ({active = true} : {
    active? : boolean
}) {
    const hidden = active ? "" : "hidden"
    return <div className={`${hidden} size-4 animate-spin rounded-2xl border-2 border-gray-500 border-t-white`}></div>
}