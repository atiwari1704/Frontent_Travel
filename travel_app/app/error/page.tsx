export default function Error({searchParams}:{searchParams:{ [key: string]: string | string[] | undefined }}){
    return (
        <main>
            <div className="min-h-screen">
                {searchParams['error']}
            </div>
        </main>
    )
}