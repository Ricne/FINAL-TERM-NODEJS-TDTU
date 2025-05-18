import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import classes from './loginPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { EMAIL } from '../../constants/patterns';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function LoginPage() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user, login, setUserData } = useAuth();
  const [params] = useSearchParams();
  const returnUrl = params.get('returnUrl');

  useEffect(() => {
    if (!user) return;
    returnUrl ? navigate(returnUrl) : navigate('/');
  }, [user, navigate, returnUrl]);

  const submit = async ({ email, password }) => {
    try {
      await login(email, password);
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('api/users/google-login', {
          credential: credentialResponse.credential,
      });
      
      localStorage.setItem('user', JSON.stringify(data));
      
      setUserData(data);

      if (data.address === 'Please update your address') {
        toast.info('Please update your profile information');
        navigate('/profile');
      } else {
      returnUrl ? navigate(returnUrl) : navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Login" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="email"
            label="Email"
            {...register('email', {
              required: true,
              pattern: EMAIL,
            })}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            {...register('password', {
              required: true,
            })}
            error={errors.password}
          />

          <Button id="loginBtn" type="submit" text="Login" />

          <div className={classes.divider}>OR</div>

          <div className={classes.googleLogin}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error('Google login failed');
              }}
            />
          </div>

          <div className={classes.register}>
            New user?&nbsp;
            <Link to={`/register${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
