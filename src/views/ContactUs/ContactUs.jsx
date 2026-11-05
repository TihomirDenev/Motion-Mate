import logo from '../../assets/logo.png';
import userPhoto from '../../assets/userPhoto.png';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function ContactUs() {
  usePageTitle(`${APP_NAME} | Contact Us`);

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-bold text-4xl'>Contact Us:</h1>
      <div className='flex flex-row my-6'>
        <div id='Tihomir'>
          <div className='flex flex-col gap-4 w-52 mx-4'>
            <div className='flex gap-4 items-center'>
              <div className='skeleton rounded-full'>
                <img src={userPhoto} />
              </div>
              <div className='flex flex-col gap-4'>
                <div className='skeleton text-center h-7 w-20'>Tihomir</div>
                <div className='skeleton text-center h-7 w-20'>Denev</div>
              </div>
            </div>
            <div className='skeleton w-full text-center pt-2'>
              <p>Cybersecurity Expert</p>
              <p>Frontend Developer</p>
              <p>Backend Developer</p>
              <hr className='w-full border-2' />
              <div className='flex flex-row justify-center my-2'>
                <a
                  href='mailto:Tihomir@motion-mate.bg'
                  data-rel='external'
                >
                  <button className='btn btn-secondary mx-2'>Email</button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id='Radoslav'>
          <div className='flex flex-col gap-4 w-52 mx-4'>
            <div className='flex gap-4 items-center'>
              <div className='skeleton rounded-full'>
                <img src={userPhoto} />
              </div>
              <div className='flex flex-col gap-4'>
                <div className='skeleton text-center h-7 w-20'>Radoslav</div>
                <div className='skeleton text-center h-7 w-20'>Marinov</div>
              </div>
            </div>
            <div className='skeleton w-full text-center pt-2'>
              <p>Cybersecurity Expert</p>
              <p>Frontend Developer</p>
              <p>Backend Developer</p>
              <hr className='w-full border-2' />
              <div className='flex flex-row justify-center my-2'>
                <a
                  href='mailto:Radoslav@motion-mate.bg'
                  data-rel='external'
                >
                  <button className='btn btn-secondary mx-2'>Email</button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id='Tanya'>
          <div className='flex flex-col gap-4 w-52 mx-4'>
            <div className='flex gap-4 items-center'>
              <div className='skeleton rounded-full'>
                <img src={userPhoto} />
              </div>
              <div className='flex flex-col gap-4'>
                <div className='skeleton text-center h-7 w-20'>Tanya</div>
                <div className='skeleton text-center h-7 w-20'>Jecheva</div>
              </div>
            </div>
            <div className='skeleton w-full text-center pt-2'>
              <p>Cybersecurity Expert</p>
              <p>Frontend Developer</p>
              <p>Backend Developer</p>
              <hr className='w-full border-2' />
              <div className='flex flex-row justify-center my-2'>
                <a
                  href='mailto:Tanya@motion-mate.bg'
                  data-rel='external'
                >
                  <button className='btn btn-secondary mx-2'>Email</button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <img
          src={logo}
          className='w-60 h-60 mx-4'
        />
      </div>
      <div className='flex flex-col items-center text-center my-2'>
        <p>
          Meet the Motion Mate Team! We are passionate about fitness and
          dedicated to helping you achieve your health goals. Whether you have a
          question, need support, or just want to share your fitness journey,
          we`re here to help. Get in touch with us and let`s move towards a
          healthier future together!
        </p>
      </div>
    </div>
  );
}
