pipeline {
    agent any

    environment {
        IMAGE_NAME = "power-store"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mohamedtarek238/back-end-power-store.git'
            }
        }

        stage('Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Scan') {
            steps {
                script {
                    scannerHome = tool 'sonar-scanner'
                }

                withSonarQubeEnv('sonarqube') {
                    sh """
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=power-store \
                    -Dsonar.projectName=power-store \
                    -Dsonar.sources=src
                    """
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build \
                -t ${IMAGE_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('List Docker Images') {
            steps {
                sh 'docker images | grep power-store'
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image \
                --severity HIGH,CRITICAL \
                ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Trivy Security Gate') {
            steps {
                sh '''
                trivy image \
                --exit-code 1 \
                --severity CRITICAL \
                ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

    }

    post {

        success {
            echo 'Pipeline completed successfully'
        }

        failure {
            echo 'Pipeline failed'
        }

        always {
            cleanWs()
        }
    }
}
