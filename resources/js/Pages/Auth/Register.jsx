import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import Label from '@/Components/Label';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { InputLabel } from '@/Components/InputLabel';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500 dark:text-gray-400" />
                </Link>
            </div>

            <Card className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={submit}>
                    <CardHeader>
                        <CardTitle>Create a new account</CardTitle>
                        <CardDescription>Enter your data to sign up</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <InputLabel useLabel={true} required={true} label="Name" type="text" name="name" id="name" value={data.name} className="mt-1 block w-full border dark:border-gray-700" autoComplete="name" onChange={(e) => setData('name', e.target.value)} />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel useLabel={true} required={true} label="Email" type="email" name="email" id="email" value={data.email} className="mt-1 block w-full border dark:border-gray-700" autoComplete="username" onChange={(e) => setData('email', e.target.value)} />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel useLabel={true} required={true} label="Password" type="password" name="password" id="password" value={data.password} className="mt-1 block w-full border dark:border-gray-700" autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel useLabel={true} required={true} label="Confirm Password" type="password" name="password_confirmation" id="password_confirmation" value={data.password_confirmation} className="mt-1 block w-full border dark:border-gray-700" autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end mt-4">
                        <Link
                            href={route('login')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="ms-4" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </CardFooter>
                </form>
            </Card>
        </GuestLayout>
    );
}
