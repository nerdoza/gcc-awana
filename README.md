# GCC Visalia Awana Club App

App designed to assist clubbers and parents for the at-home Awana program. The app includes functionality for tracking clubber and parent information, assigning clubbers to leaders, tracking book progress, and calculating Awana bucks earned through completed sections.

## Future Improvements

There are still 2 large areas that I intend to develope further. The first is the Admin section which is currently empty. The second is a virtual store for clubbers to use their earned Awana Bucks on larger items that they can pick-up from the church office.

## Forking this repo

Many of the decisions I made during development were made to speed development and are not necessarily the most flexible. I'll outline the decisions which would require addressing if you intend to fork this repo for your own church's program. This app is designed to be very low cost to deploy and maintain.

### Infrastructure

This app can be built to deploy to the web, Android (Google Play), iOS (Apple App Store), or desktop (PC, Mac). The back-end infrastructure relies on Google Firebase and can be ran entirely under their free tier. The Firestore rules are stored on the [`firebase-cli`](https://github.com/bayssmekanique/gcc-awana/tree/firebase-cli) branch, along with a development environment for local testing.

### Development

For initial development, clone both the `master` and the `firebase-cli` branches (to their own directories). The `master` branch can be ran from any operating system but is designed to take advantage of the tooling offered by Visual Studio Code.  The `firebase-cli` branch is designed to be ran on Linux, but thanks to the Remote Development plugin for VS Code, it can be ran in VS Code under the [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

### Potential issues/changes required

1) Parents assigned via phone number - Currently parents are linked to clubbers via their phone number. The reason for this is that parents aren't assigned UUIDs until after they have signed up for the app, so importing clubbers without having parents registered would be an issue. With the current system clubbers can be loaded with their parent's phone numbers via a CSV files and parents are automatically linked to their clubbers as they register. The downside is that there is no way in Firestore to limit access based on the parent's phone number, so all clubbers could be accessed by any parent. The app does not allow this to happen, but it's not strictly save and is something I would like to resolve.

2) FontAwesome Pro icons - The icons used are Font Awesome Pro icons, which require a license to use. I have a license and can use them on my personal projects, but I understand others might not. The solution would be to remove all references to the Pro icons and replace them with their free variants.

3) User role structure - The current structure of the `userRoles` model causes a very high number of Firestore reads for almost every action. I was not aware of the limitations of the Firestore datastore when I selected it and I would like to move this to a true relational database for future versions.

## Copyright and License
Copyright (c) 2020 Zachary Cardoza https://zachcardoza.com

Licensed under the [MIT License](./LICENSE.md).

All Awana® logos, images, book titles, and materials used and referenced within this application are registered trademarks and service marks of Awana, and are used in accordance with the Terms and Conditions declared at https://www.awana.org/tt-clip-art/.