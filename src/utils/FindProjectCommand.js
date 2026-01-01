const FindProjectCommand = (projectType) => {
    switch (projectType) {
        case 'react':
            return 'npx create-react-app .';
        case 'vite':
            return 'npm create vite@latest . -- --template react';
        case 'nextjs':
            return `npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --no-install --yes`;
        case 'angular':
            return 'npx @angular/cli new . --defaults';
        case 'vue':
            return 'npm init vue@latest .';
        case 'svelte':
            return 'npx degit sveltejs/template .';
        case 'node':
            return 'npm init -y';
        case 'express':
            return 'npx express-generator .';
        case 'django':
            return 'django-admin startproject mysite .';
        case 'flask':
            return 'pip install Flask && mkdir app && echo "from flask import Flask\napp = Flask(__name__)\n\
              @app.route(\'/\')\ndef hello_world():\n    return \'Hello, World!\'\n\nif __name__ == \'__main__\':\n    app.run()" > app/app.py';
        case 'ruby-on-rails':
            return 'gem install rails && rails new .';
        case 'laravel':
            return 'composer create-project --prefer-dist laravel/laravel .';
        case 'spring-boot':
            return 'curl https://start.spring.io/starter.tgz -d dependencies=web -d baseDir=. | tar -xzvf -';
        case 'flutter':
            return 'flutter create .';
        case 'react-native':
            return 'npx react-native init ProjectName';
        default:
            throw new Error('Unsupported project type');
    }
}
export default FindProjectCommand;