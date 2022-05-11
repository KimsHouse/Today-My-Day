import { getAxios } from '../api'
import { all, fork, takeLatest, call, put } from 'redux-saga/effects'
import {
  ARTICLE_ADD_FAILURE,
  ARTICLE_ADD_REQUEST,
  ARTICLE_ADD_SUCCESS,
  ARTICLE_LIST_REQUEST,
  ARTICLE_LIST_SUCCESS,
  ARTICLE_LIST_FAILURE,
  DIARY_SEARCH_WORD_REQUEST,
  DIARY_SEARCH_WORD_SUCCESS,
  DIARY_SEARCH_WORD_FAILURE,
  DIARY_SEARCH_CONTENT_REQUEST,
  DIARY_SEARCH_CONTENT_SUCCESS,
  DIARY_SEARCH_CONTENT_FAILURE,
} from '../reducers/article'

const axios = getAxios()

function articleAddAPI(data) {
  return axios.post('diary', data.data, { params: { userId: data.userId } })
}

function* articleAdd(action) {
  const navigate = action.data.navigate
  try {
    const res = yield call(articleAddAPI, action.data)
    console.log('res', res)
    yield put({
      type: ARTICLE_ADD_SUCCESS,
      data: action.data,
    })
    action.data.Modal.success({
      content: '글 등록 완료',
      onOk() {
        navigate(`/diary/read/${res.data.diary.dno}`)
      },
    })
  } catch (err) {
    yield put({
      type: ARTICLE_ADD_FAILURE,
      error: err.response.data,
    })
  }
}

function articleListAPI(data) {
  return axios.get('/user/read/', { params: { userId: data } })
}

function* articleList(action) {
  try {
    const result = yield call(articleListAPI, action.data)
    const dairies = result.data.user.dairies
    yield put({
      type: ARTICLE_LIST_SUCCESS,
      data: dairies,
    })
  } catch (err) {
    yield put({
      type: ARTICLE_LIST_FAILURE,
      error: err.response.data,
    })
  }
}

function diarySearchWordAPI(data) {
  const searchKind = data.searchKind
  return axios.get(`diary/${searchKind}`, { params: { userId: data.userId, word: data.word } })
}

function* diarySearchWord(action) {
  try {
    const result = yield call(diarySearchWordAPI, action.data)
    yield put({
      type: DIARY_SEARCH_WORD_SUCCESS,
      data: result.data,
    })
    yield action.data.setData(result.data)
  } catch (err) {
    yield put({
      type: DIARY_SEARCH_WORD_FAILURE,
      error: err.response.data,
    })
  }
}

function diarySearchContentAPI(data) {
  const searchKind = data.searchKind
  return axios.get(`diary/${searchKind}`, {
    params: { keyword: data.keyword, userId: data.userId },
  })
}

function* diarySearchContent(action) {
  try {
    const result = yield call(diarySearchContentAPI, action.data)
    yield put({
      type: DIARY_SEARCH_CONTENT_SUCCESS,
      data: result.data,
    })
    yield action.data.setData(result.data)
  } catch (err) {
    yield put({
      type: DIARY_SEARCH_CONTENT_FAILURE,
      error: err.response.data,
    })
  }
}

function* watchArticleAdd() {
  yield takeLatest(ARTICLE_ADD_REQUEST, articleAdd)
}

function* watchArticleList() {
  yield takeLatest(ARTICLE_LIST_REQUEST, articleList)
}

function* watchDiarySearchWord() {
  yield takeLatest(DIARY_SEARCH_WORD_REQUEST, diarySearchWord)
}

function* watchDiarySearchContent() {
  yield takeLatest(DIARY_SEARCH_CONTENT_REQUEST, diarySearchContent)
}

export default function* userSaga() {
  yield all([
    fork(watchArticleAdd),
    fork(watchArticleList),
    fork(watchDiarySearchWord),
    fork(watchDiarySearchContent),
  ])
}
