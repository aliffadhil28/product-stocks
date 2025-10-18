import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Paws & Claws Grooming Salon" />
            <div className="min-h-screen bg-paw-print">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <div className="w-10 h-10 bg-soft-blue rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <span className="ml-3 text-xl font-light text-gray-700">Paws & Claws</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="bg-soft-blue text-white px-5 py-2 rounded-lg font-medium hover:bg-soft-blue-dark transition duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-soft-blue font-medium transition duration-300"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-soft-orange text-white px-5 py-2 rounded-lg font-medium hover:bg-soft-orange-dark transition duration-300"
                                        >
                                            Reservasi
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 leading-tight">
                                Perawatan & Grooming
                                <span className="block text-soft-blue">Profesional untuk Hewan Peliharaan</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Berikan perawatan terbaik untuk sahabat berbulu Anda.
                                Layanan grooming profesional dengan penuh kasih sayang.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('register')}
                                    className="bg-soft-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-soft-blue-dark transition duration-300 shadow-sm"
                                >
                                    Reservasi Sekarang
                                </Link>
                                <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-300">
                                    Lihat Layanan
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 bg-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-light text-gray-800 mb-4">Layanan Kami</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Berbagai layanan grooming lengkap untuk semua kebutuhan hewan peliharaan Anda
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Service 1 */}
                            <div className="bg-white rounded-xl p-6 hover:shadow-md transition duration-300 border border-gray-100">
                                <div className="w-12 h-12 bg-soft-blue/10 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-soft-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-3">Paket Grooming Lengkap</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Perawatan spa lengkap termasuk mandi, potong bulu, pemotongan kuku, pembersihan telinga, dan sikat gigi.
                                </p>
                                <div className="text-soft-orange font-medium">Rp 150.000 - 300.000</div>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-white rounded-xl p-6 hover:shadow-md transition duration-300 border border-gray-100">
                                <div className="w-12 h-12 bg-soft-orange/10 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-soft-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-3">Mandi & Sisir</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Mandi menyegarkan dengan shampoo premium, sisir menyeluruh, dan kondisioner bulu.
                                </p>
                                <div className="text-soft-orange font-medium">Rp 75.000 - 150.000</div>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-white rounded-xl p-6 hover:shadow-md transition duration-300 border border-gray-100">
                                <div className="w-12 h-12 bg-soft-blue/10 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-soft-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-3">Perawatan Spa Premium</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Paket premium dengan facial blueberry, pijat kaki, dan aromaterapi untuk relaksasi.
                                </p>
                                <div className="text-soft-orange font-medium">Rp 250.000 - 450.000</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-light text-gray-800 mb-6">
                                    Mengapa Memilih Paws & Claws?
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-soft-blue/10 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-soft-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-2">Groomer Bersertifikat</h3>
                                            <p className="text-gray-600 text-sm">Tim kami terdiri dari groomer profesional yang terlatih dan bersertifikat.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-soft-orange/10 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-soft-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-2">Fasilitas Modern</h3>
                                            <p className="text-gray-600 text-sm">Peralatan terkini dan lingkungan yang bersih dan aman untuk hewan peliharaan Anda.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-10 h-10 bg-soft-blue/10 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-soft-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-2">Jadwal Fleksibel</h3>
                                            <p className="text-gray-600 text-sm">Booking online mudah dengan janji temu malam dan akhir pekan tersedia.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                                    <div className="aspect-w-16 aspect-h-12 bg-gray-50 rounded-lg mb-6 overflow-hidden">
                                        <div className="w-full h-64 bg-gradient-to-br from-soft-blue/10 to-soft-orange/10 flex items-center justify-center">
                                            <svg className="w-24 h-24 text-soft-blue opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-4">Hewan Bahagia, Pemilik Tenang</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Bergabunglah dengan ribuan pemilik hewan peliharaan yang mempercayakan keluarga berbulu mereka kepada kami.
                                        Komitmen kami terhadap kualitas dan perawatan memastikan pengalaman terbaik untuk hewan peliharaan Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="py-16 bg-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-light text-gray-800 mb-4">Apa Kata Pelanggan</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Testimoni dari pemilik hewan yang sudah mempercayakan perawatan kepada kami
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-soft-blue/10 rounded-full flex items-center justify-center">
                                        <span className="text-soft-blue font-medium">SD</span>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="font-medium text-gray-800">Sari Dewi</h4>
                                        <p className="text-gray-500 text-sm">Pemilik Kucing</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm italic">
                                    "Pelayanan sangat ramah dan profesional. Kucing saya pulang bersih dan wangi. Highly recommended!"
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-soft-orange/10 rounded-full flex items-center justify-center">
                                        <span className="text-soft-orange font-medium">BA</span>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="font-medium text-gray-800">Budi Anwar</h4>
                                        <p className="text-gray-500 text-sm">Pemilik Anjing</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm italic">
                                    "Anjing saya yang biasanya takut grooming jadi sangat tenang di sini. Groomernya sabar banget."
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-soft-blue/10 rounded-full flex items-center justify-center">
                                        <span className="text-soft-blue font-medium">MR</span>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="font-medium text-gray-800">Maya Ratna</h4>
                                        <p className="text-gray-500 text-sm">Pemilik Kucing</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm italic">
                                    "Fasilitas bersih dan nyaman. Harga terjangkau untuk kualitas service yang diberikan."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-soft-blue/10 to-soft-orange/10">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-light text-gray-800 mb-6">Siap Memanjakan Hewan Peliharaan Anda?</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Reservasi janji temu hari ini dan berikan perawatan mewah yang layak mereka dapatkan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route('register')}
                                className="bg-soft-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-soft-blue-dark transition duration-300 shadow-sm"
                            >
                                Reservasi Sekarang
                            </Link>
                            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-300 border border-gray-200">
                                Hubungi Kami: (021) 1234-5678
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800/90 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-xl font-light mb-4">Paws & Claws</h3>
                                <p className="text-gray-300 text-sm">
                                    Layanan grooming hewan peliharaan profesional dengan penuh kasih sayang untuk sahabat berbulu Anda.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium mb-4">Layanan</h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li>Grooming Lengkap</li>
                                    <li>Mandi & Sisir</li>
                                    <li>Perawatan Spa</li>
                                    <li>Potong Kuku</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium mb-4">Kontak</h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li>Jl. Melati No. 123</li>
                                    <li>Jakarta Selatan, 12345</li>
                                    <li>(021) 1234-5678</li>
                                    <li>hello@pawsclaws.id</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium mb-4">Jam Operasional</h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li>Senin-Jumat: 08.00-18.00</li>
                                    <li>Sabtu: 09.00-17.00</li>
                                    <li>Minggu: 10.00-16.00</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                            <p>&copy; 2024 Paws & Claws Grooming Salon. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                .bg-paw-print {
                    background-color: #fafafa;
                    background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,40 C25,35 20,40 25,45 C30,50 35,45 30,40 Z M45,30 C40,25 35,30 40,35 C45,40 50,35 45,30 Z M60,40 C55,35 50,40 55,45 C60,50 65,45 60,40 Z M50,50 C45,45 40,50 45,55 C50,60 55,55 50,50 Z M35,60 C30,55 25,60 30,65 C35,70 40,65 35,60 Z M65,60 C60,55 55,60 60,65 C65,70 70,65 65,60 Z' fill='%2336ace1' opacity='0.03'/%3E%3C/svg%3E");
                }
                .bg-soft-blue {
                    background-color: #36ace1;
                }
                .bg-soft-blue-dark {
                    background-color: #2a8cc7;
                }
                .bg-soft-orange {
                    background-color: #f79f1d;
                }
                .bg-soft-orange-dark {
                    background-color: #e68e17;
                }
                .text-soft-blue {
                    color: #36ace1;
                }
                .text-soft-orange {
                    color: #f79f1d;
                }
                .bg-soft-blue\\/10 {
                    background-color: rgba(54, 172, 225, 0.1);
                }
                .bg-soft-orange\\/10 {
                    background-color: rgba(247, 159, 29, 0.1);
                }
                .from-soft-blue\\/10 {
                    --tw-gradient-from: rgba(54, 172, 225, 0.1);
                    --tw-gradient-to: rgba(54, 172, 225, 0);
                    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
                }
                .to-soft-orange\\/10 {
                    --tw-gradient-to: rgba(247, 159, 29, 0.1);
                }
            `}</style>
        </>
    );
}