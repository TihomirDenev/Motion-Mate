<img src="src/assets/logo.png" width="100" height="100">

## Motion.Mate

Fitness tracking application, where app offers both public and private features, including an administrative section, allowing users to send friend requests, add friends, create goals and exercises, and calculate their body mass index. It provides a comprehensive platform to connect with friends and achieve fitness objectives.

**Languages:** <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" height="20"> <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" height="20">

**Frameworks/Libraries:** <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" height="20"> <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" height="20"> <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" height="20"> <img src="https://img.daisyui.com/images/daisyui-logo/daisyui-logotype.svg" height="20"> <img src="https://camo.githubusercontent.com/285fdadfaf59ede5da219ccf9f8278322e8f85cfa48f5ba33df53ce2f0c72098/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f566974652d4237334246453f7374796c653d666f722d7468652d6261646765266c6f676f3d76697465266c6f676f436f6c6f723d464644363245" height='20'>

**Linters:** <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white" height="20">

**Databases:** <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white" height="20">

**Browsers:** <img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Safari-000000?style=for-the-badge&logo=Safari&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=Microsoft-edge&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Opera-FF1B2D?style=for-the-badge&logo=Opera&logoColor=white" height="20">

## <img src="https://firebasestorage.googleapis.com/v0/b/dare2fit-f6eb4.appspot.com/o/assets%2FREADME-images%2Ffeatures.png?alt=media&token=e5fc5779-b3db-41c2-a576-947ca382ea5a&_gl=1*81oei1*_ga*MjExMzk5MTA5MC4xNjgzMjcwMjg1*_ga_CW55HF8NVT*MTY4NjU3Njg5Ni4xMDMuMS4xNjg2NTc3OTgzLjAuMC4w"  width="30" height="30"> Features

- For first-time users we present a quick overview of our `Motion Mate` community right on the `Landing Page`:

  - a **total count** of all `Motion Mate` users;
  - a **total count** of all `Motion Mate` category exercises;
  - a **total count** of all `Motion Mate` available exercises;

- Want to join?
  - Head right on to the `Register` page and create your profile with a username, email, password, and telephone;
- Already a member?
  - Make sure to `Log In` to re-enter your profile and use all functionality;
- Once in your account you have access to our all `Motion Mate` tabs:

- The `Wellness and Health Tools` tab is where you will find your central dashboard:

  - BMI Calculator: Body Mass Index (BMI) is a measure of body fat based on height and weight. It's a simple calculation that helps individuals understand their body composition and potential health risks associated with being underweight, overweight, or obese. Users can input their height and weight into the BMI calculator to get their BMI score, which is then categorized into different ranges such as underweight, normal weight, overweight, or obese.

  - Water Intake Calculator: Proper hydration is essential for overall health and well-being. The water intake calculator helps users determine how much water they should drink daily based on factors like weight and activity level. It provides personalized recommendations to ensure users stay adequately hydrated throughout the day.

  - Calorie Calculator: Monitoring calorie intake is crucial for maintaining a healthy weight and achieving fitness goals. The calorie calculator allows users to estimate the number of calories they need to consume each day based on factors like age, gender, weight, height and activity level. It provides a guideline for creating balanced meal plans and making informed dietary choices.

- The `Exercises` tab allows you to create brand new exercises.
- The `Goals` tab is where you can add new goals, setting yourself either recurring targets or challenge yourself within a certain timeframe.
- The `All Users` tab allows you to interact with other users:
  - Search users by their first name or username ;
  - Sort users by username or date if creation;
  - Send them friend requests;
  - Check and manage your friends list;
  - Check and manage your Sent friend requests;
- The `My Profile` tab, accessible by clicking on your profile at the top-right of the navbar, allows you to:
  - See all information about your profile and your profile photo;
  - Edit your general and health data details from the `Edit Profile` tab;
  - Edit your profile photo from the `Change Photo` tab;
- Alternatively, other users `View Profile` tabs will allow you to view their general details.

## <img src="https://firebasestorage.googleapis.com/v0/b/dare2fit-f6eb4.appspot.com/o/assets%2FREADME-images%2Fstart.png?alt=media&token=ee8cc2b3-1a61-4519-9f96-59177216b4d6&_gl=1*t5p8co*_ga*MjExMzk5MTA5MC4xNjgzMjcwMjg1*_ga_CW55HF8NVT*MTY4NjU3Njg5Ni4xMDMuMS4xNjg2NTc4MDEzLjAuMC4w"  width="30" height="30"> Getting Started

To install and run the project, follow these steps:

**Requirements:** [Node.js](https://nodejs.org/) 24 LTS (see `.nvmrc` — run `nvm use` if you use nvm).

1. Clone the [Motion Mate _GitHub repository_](https://github.com/TihomirDenev/Motion-Mate) locally:

```bash
git clone https://github.com/TihomirDenev/Motion-Mate.git
```

2. Navigate to the project directory:

```bash
cd Motion-Mate
```

3. Install project dependencies:

```bash
npm install
```

4. Create a `.env.local` file from the example and fill in your Firebase web app config (Firebase Console → Project settings → Your apps):

```bash
cp .env.example .env.local
```

5. To run the project, use the following command:

```bash
npm run dev
```

6. Open the localhost link in the browser to view the web platform.

### Available scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the dev server                     |
| `npm run build`        | Build for production into `dist/`        |
| `npm run preview`      | Preview the production build locally     |
| `npm run lint`         | Lint the project with ESLint             |
| `npm run format`       | Format the code with Prettier            |
| `npm run format:check` | Check the formatting without changing it |

### Deploying to Vercel

1. Import the GitHub repository in [Vercel](https://vercel.com/new). The Vite preset is detected automatically (build command `npm run build`, output directory `dist`).
2. In **Settings → Environment Variables** add all `VITE_FIREBASE_*` variables from `.env.example`.
3. In Firebase Console → **Authentication → Settings → Authorized domains** add your Vercel domain.

Client-side routing is handled by the rewrite in `vercel.json`.

## <img src="https://firebasestorage.googleapis.com/v0/b/dare2fit-f6eb4.appspot.com/o/assets%2FREADME-images%2Fdatabase.png?alt=media&token=958f4c41-6532-4e07-a31d-e437ebe00527&_gl=1*o97b6d*_ga*MjExMzk5MTA5MC4xNjgzMjcwMjg1*_ga_CW55HF8NVT*MTY4NjU3Njg5Ni4xMDMuMS4xNjg2NTc3OTQ0LjAuMC4w"  width="30" height="30"> Database Scheme (Structure)

### Users document:

```js
users: {
  username: {
    username: <string>,
    email: <string>,
    phoneNumber: <number>,
    avatar: <string>,
    createdOn: <number>,
    age: <number>,
    firstName: <string>,
    lastName: <string>,
    height: <number>,
    weight: <number>,
    isBlocked: <boolean>,
    userRole: <string>,
    uid: <string>,
    activityLevel: <string>
    gender: <string>
    friends: { <object> (optional)
      username: <boolean>,
      ...
    },
    requests: { <object> (optional)
      username: <boolean>,
      ...
    },
    myRequests: { <object> (optional)
      username: <boolean>,
      ...
    },
    myGoals: { <object> (optional)
      uid: { <object>
        name: <string>,
        owner: <string>,
        progress: <number>,
        timePeriod: { <object>
          from: <number>,
          to: <number>,
        }
      }
      ...
    },
    previousScores:{ <object> (optional)
      uid: <string>
    }
    updatedScores:{ <object> (optional)
      doneExercises: <number>,
      updatedCalories: <number>
    }
  }
  ...
}

```

### Categories document:

```js
categories: {
  category: {
        uid: { <object>
          description: <string>
          imageUrl: <string>
        }
      ...
  }
  ...
}

```

### Exercises document:

```js
exercises: {
  uid: {
    calories: <number>,
    categoryId: <string>,
    content: <string>
    createdBy: <string>
    duration: { <object>
      hours: <number>
      minutes: <number>
      seconds: <number>
    }
    inProgress: <boolean>
    level: <string>
    title: <string>
  }
  ...
}

```

## <img src="https://firebasestorage.googleapis.com/v0/b/dare2fit-f6eb4.appspot.com/o/assets%2FREADME-images%2Ffaq.png?alt=media&token=12b5c59f-8faf-4cba-98f4-b6cd9329b78b&_gl=1*9f9cxq*_ga*MjExMzk5MTA5MC4xNjgzMjcwMjg1*_ga_CW55HF8NVT*MTY4NjU3Njg5Ni4xMDMuMS4xNjg2NTc3OTYxLjAuMC4w"  width="30" height="30"> Frequently Asked Questions

- **How can I create a profile on Motion Mate?**
  - To create a profile you simply need to click **`Register`** on the top left of the navigation menu and navigate to the **`Sign Up`** page from there. Choose a username, enter your email address and telephone number, create a password, and you're done! You will then have a page with additional information about you. You can add more information now or skip it and add it later.
- **What can I do on Motion Mate?**
  - Motion Mate is to those who are dedicated to a healthy lifestyle and seek to better themselves! You can create and assemble workout routines, which can present you with a huge amount of effective exercises. You can browse other users and add them as friends from the `All Users`.
- **User Interaction and Admin Roles?**

  -**Normal User Actions:**

  - Sending Friend Requests: You can search for and send friend requests to other users. This allows you to expand your network and connect with others who share similar interests.
  - Canceling Friend Requests: If you change your mind after sending a friend request, you have the option to cancel it before the recipient responds. This gives you control over your outgoing friend requests.
  - Managing Friend List: Once a friend request is accepted, the user is added to your friend list. You can view all your friends in one place. If you no longer wish to be friends with someone, you can remove them from your friend list at any time.

  -**Admin Actions:**

  - To become an admin, you can contact us through the `Contact Us` section. As an admin, you gain additional privileges and responsibilities that allow you to manage and moderate the app effectively. These include:
  - Blocking Users: You have the authority to block users who violate the app's policies or engage in inappropriate behavior. This helps maintain a safe and respectful community.
  - Assigning Admin Roles: You can grant admin privileges to other users, empowering them to assist with moderation and management tasks across the platform.
  - Deleting Users: You have the ability to delete users from the app if necessary, ensuring that the community remains secure and free from harmful activities.
  - Moderating Content: You can moderate content related to Goals and Exercises, ensuring that all posts adhere to the app's guidelines and standards. This helps maintain the quality and relevance of the content shared on the platform.

- **How can i calculate my Body Mass Index?**

  - When you go to the BMI page, you can choose between the metric or imperial system. Enter your weight and height, click 'Calculate,' and see your BMI.

- **How can I calculate my Daily Water Intake?**

  - When you go to the Water Intake Calculator, you can choose between the metric or imperial system. Enter your weight and activity level, click 'Calculate,' and see your recommended daily water intake.

- **How can I calculate my Daily Calorie Intake?**
  - When you go to the Calorie Calculator, you can choose between the metric or imperial system. Enter your weight, height, age, gender, and activity level, click 'Calculate,' and see your recommended daily calorie intake.

## <img src="https://firebasestorage.googleapis.com/v0/b/dare2fit-f6eb4.appspot.com/o/assets%2FREADME-images%2Fcommunity.png?alt=media&token=893ecd6f-908b-4c1e-9223-25d82f1bb8b1&_gl=1*watnuy*_ga*MjExMzk5MTA5MC4xNjgzMjcwMjg1*_ga_CW55HF8NVT*MTY4NjU3Njg5Ni4xMDMuMS4xNjg2NTc3OTI1LjAuMC4w"  width="30" height="30"> Community and Contributions

- The `Motion Mate` platform is developed by **Team 1** (Tihomir Denev, Radoslav Marinov and Tanya Jecheva).

- [Tanya Zhecheva](https://github.com/TanyaZhecheva) Clicking on the name will take you to the GitHub profile of Tanya Zhecheva.

- [Tihomir Denev](https://github.com/TihomirDenev) Clicking on the name will take you to the GitHub profile of Tihomir Denev.

- [Radoslav Marinov](https://github.com/Radoslav-Marinovv) Clicking on the name will take you to the GitHub profile of Radoslav Marinov.

## <img src="https://firebasestorage.googleapis.com/v0/b/dare2fit-f6eb4.appspot.com/o/assets%2FREADME-images%2Fresources.png?alt=media&token=9fe5f5ee-5413-4af3-a50b-c7f01650d1fe&_gl=1*4u0xo2*_ga*MjExMzk5MTA5MC4xNjgzMjcwMjg1*_ga_CW55HF8NVT*MTY4NjU3Njg5Ni4xMDMuMS4xNjg2NTc3OTk4LjAuMC4w"  width="30" height="30"> Hosting Information and Deployment

- This site is hosted on GitHub Pages, which provides free hosting for static websites directly from GitHub repositories. You can view the live site here: [Motion Mate GitHub pages](https://a58-agents-team1.github.io/Motion.Mate/).

- We use GitHub Actions for automated deployment. The deploy.yml workflow handles the build and deployment process to GitHub Pages, ensuring that the latest changes are always live on the site.
