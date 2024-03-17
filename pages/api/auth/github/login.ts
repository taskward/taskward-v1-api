import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import stringRandom from 'string-random'

import { prisma } from '@/database'
import { AuthType, User } from '@prisma/client'

import { errorHandler, createToken } from '@/utils'
import { ErrorModel, JWTUserModel } from '@/interfaces'

import { getGitHubUserInfoByAccessToken } from './_services'
import { LoginResult } from './_interfaces'
import { LOGIN_FAILED, POST_GITHUB_TOKEN_URL, ERROR_401_MESSAGE_NO_TOKEN } from './_constants'

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<LoginResult | ErrorModel>
) => {
  try {
    if (request.method === 'OPTIONS') {
      response.status(200).end()
      return
    }
    if (request.method !== 'POST') {
      response.status(405).end()
      return
    }

    const requestCode = request.query.code

    if (!requestCode) {
      response.status(401).json({ errorKey: ERROR_401_MESSAGE_NO_TOKEN })
      return
    }

    const tokenResponse = await axios({
      method: 'POST',
      url:
        POST_GITHUB_TOKEN_URL +
        `?client_id=${process.env.GITHUB_CLIENT_ID}&` +
        `client_secret=${process.env.GITHUB_CLIENT_SECRET}&` +
        `code=${requestCode}`,
      headers: {
        accept: 'application/json;charset=utf-8'
      }
    })

    if (!tokenResponse.data.access_token) {
      response.status(401).json({ errorKey: ERROR_401_MESSAGE_NO_TOKEN })
      return
    }

    const accessToken = tokenResponse.data.access_token

    // Get GitHub user info
    const githubUserInfo = await getGitHubUserInfoByAccessToken(tokenResponse.data.access_token)

    if (!githubUserInfo) {
      response.status(404).end()
      return
    }

    // Check auth info
    const auth = await prisma.auth.findFirst({
      include: { User: true },
      where: {
        authType: AuthType.GITHUB,
        openId: githubUserInfo.id,
        deletedAt: null
      }
    })

    if (auth) {
      // Change AccessToken
      const shouldChangeAccessToken: boolean = auth.accessToken !== accessToken
      shouldChangeAccessToken &&
        (await prisma.auth.update({
          where: { id: auth.id },
          data: {
            accessToken: accessToken
          }
        }))

      // Generate JWT Token
      const jwtUserModel: JWTUserModel = {
        username: auth.User.username,
        userId: auth.User.id,
        role: auth.User.role
      }
      const generatedToken = createToken(jwtUserModel)
      if (!generatedToken) {
        response.status(401).json({ errorKey: LOGIN_FAILED })
        return
      }

      const userResult: Partial<User> = {
        id: auth.userId,
        username: auth.User.username,
        email: auth.User.email,
        name: auth.User.name,
        avatarUrl: auth.User.avatarUrl,
        biography: auth.User.biography,
        location: auth.User.location,
        role: auth.User.role
      }

      response.status(200).json({
        accessToken: generatedToken,
        user: userResult
      })
    } else {
      // Insert a user and auth
      const user: User = await prisma.user.create({
        data: {
          username: 'User-' + stringRandom(8),
          email: githubUserInfo.email,
          name: githubUserInfo.name ?? githubUserInfo.login,
          avatarUrl: githubUserInfo.avatarUrl,
          biography: githubUserInfo.bio,
          location: githubUserInfo.location,
          auths: {
            create: {
              authType: AuthType.GITHUB,
              accessToken: accessToken,
              openId: githubUserInfo.id
            }
          }
        }
      })

      await prisma.note.create({
        data: {
          userId: user.id,
          name: '👏 欢迎来到 Taskward',
          description: '这里是一个简易的示例，您可以将记录放在这里',
          tasks: {
            createMany: {
              data: [
                {
                  content: '作者 GitHub 主页',
                  linkUrl: 'https://github.com/recallwei'
                },
                {
                  content: 'Taskward 主页',
                  linkUrl: 'https://taskward.bruceworld.top'
                },
                {
                  content: '这是一个 Task，点击左侧 👈 勾选即表示已完成 ✅'
                },
                {
                  content: '已经完成的 Task',
                  finishedAt: new Date().toISOString()
                }
              ]
            }
          }
        }
      })

      // Generate JWT Token
      const jwtUserModel: JWTUserModel = {
        username: user.username,
        userId: user.id,
        role: user.role
      }
      const generatedToken = createToken(jwtUserModel)
      if (!generatedToken) {
        response.status(401).json({ errorKey: LOGIN_FAILED })
        return
      }

      const userResult: Partial<User> = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        biography: user.biography,
        location: user.location,
        role: user.role
      }

      response.status(200).json({
        accessToken: generatedToken,
        user: userResult
      })
    }
  } catch (error) {
    response.status(500).end(errorHandler(error))
  }
}

export default handler
