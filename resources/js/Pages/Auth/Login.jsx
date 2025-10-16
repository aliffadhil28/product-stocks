import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import Label from '@/Components/Label';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { InputLabel } from '@/Components/InputLabel';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <Card className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={submit}>
                    <CardHeader>
                        <CardTitle>Login to yout account</CardTitle>
                        <CardDescription>Enter your email and password to sign in</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <InputLabel useLabel={true} required={true} label="Email" type="email" name="email" id="email" value={data.email} className="mt-1 block w-full border dark:border-gray-700" autoComplete="email" onChange={(e) => setData('email', e.target.value)} />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel useLabel={true} required={true} label="Password" type="password" name="password" id="password" value={data.password} className="mt-1 block w-full border dark:border-gray-700" autoComplete="current-password" onChange={(e) => setData('password', e.target.value)} />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    className='rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500'
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <PrimaryButton className="ms-4" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </CardFooter>
                </form>
            </Card>
        </GuestLayout>
    );
}
