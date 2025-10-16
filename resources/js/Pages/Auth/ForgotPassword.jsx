import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div>

            <form onSubmit={submit}>
                <Card className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription className="mb-4 text-sm text-gray-600">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password
                            reset link that will allow you to choose a new one.

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </CardContent>
                    <CardFooter className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            Email Password Reset Link
                        </PrimaryButton>
                    </CardFooter>
                </Card>
            </form>
        </GuestLayout>
    );
}
