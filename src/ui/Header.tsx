export default function Header({ appName }: { appName: string }) {
    return (
        <header className="navbar bg-base-100">
            <section className="navbar-section">
                <h1 className="inline-block text-2xl">{appName}</h1>
            </section>
        </header>
    );
}
