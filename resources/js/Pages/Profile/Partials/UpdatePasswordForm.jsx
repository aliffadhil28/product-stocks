import { useRef } from 'react';
import InputError from '@/Components/InputError';
import Label from '@/Components/Label';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { InputLabel } from '@/Components/InputLabel';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel useLabel={true} required={true} label="Current Password" type="password" name="current_password" id="current_password" value={data.current_password} className="mt-1 block w-full" autoComplete="current-password" onChange={(e) => setData('current_password', e.target.value)} />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel useLabel={true} required={true} label="New Password" type="password" name="password" id="password" value={data.password} className="mt-1 block w-full" autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel useLabel={true} required={true} label="Confirm Password" type="password" name="password_confirmation" id="password_confirmation" value={data.password_confirmation} className="mt-1 block w-full" autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-200">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
