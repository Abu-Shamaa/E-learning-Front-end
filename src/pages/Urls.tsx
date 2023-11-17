//const baseUrl = "https://api-el.finworld.com";
const baseUrl = "http://elearnb.test";
export const tinyMceKey = "4ssv18itj219ypjz3qswnxzqmm2hweixk8npflz0yvf3edim";
export default baseUrl;

export const api = {

    changePassword: "/api/change/password",
    signUp: "/api/auth/register",
    checkUser: "/api/users/",

    //**** ADMIN *****//
    /////////media
    media: "/api/media",

    ///////// articles
    checkSlug: "/api/article/",
    createArticle: "/api/add/article",
    createSlug: "/api/slug/create",
    login: "/api/auth/login",
    allArticle: "/api/articles",
    editArticle: "/api/edit/articles/",
    updatetArticle: "/api/update/articles/",
    deleteArticle: "/api/delete/articles/",
    trashArticle: "/api/articles/trash",
    restoreArticle: "/api/restore/articles/",
    forceDelete: "/api/forceDelete/articles/",
    approveArticle: "/api/appropve/articles/",

    /////////category
    allCategory: "/api/category",
    addCategory: "/api/add/category",
    deleteCategory: "/api/delete/category/",
    showCategory: "/api/show/category/",
    updateCategory: "/api/update/category/",
    slugCheck: "/api/category/",
    categorySlug: "/api/category/slug",

    /////////group
    allGroup: "/api/groups",
    addGroup: "/api/add/group",
    deleteGroup: "/api/delete/groups/",
    editGroup: "/api/edit/groups/",
    updateGroup: "/api/update/groups/",

    /////////instructors
    allInstructor: "/api/instructors",
    addInstructor: "/api/add/instructor",
    updateInstructor: "/api/update/instructor/",
    deleteInstructor: "/api/delete/instructor/",

    ///courses
    allCourse: "/api/courses",
    myCourse: "/api/my/course",
    pendingEnrole: "/api/pending/enrole",
    allPending: "/api/pending/all",
    approve: "/api/enrole/approve/",
    disapprove: "/api/enrole/disapproved/",
    addCourse: "/api/add/course",
    courseEnrole: "/api/course/enrole",
    unEnrole: "/api/course/unenrole/",
    deleteCourse: "/api/delete/course/",
    showCourse: "/api/show/course/",
    editCourse: "/api/edit/course/",
    updateCourse: "/api/update/course/",

    ///topics
    allTopic: "/api/topics",
    addTopic: "/api/add/topic",
    addTopicContent: "/api/add/topic/file",
    downloadTopicContent: "/api/download/topic/file/",
    addTopicArticle: "/api/add/topic/article",
    updateTopicArticle: "/api/update/topic/article/",
    showTopicArticle: "/api/show/topic/article/",
    deleteTopic: "/api/delete/topic/",
    deleteTopicArticle: "/api/delete/topic/article/",
    deleteTopicContent: "/api/delete/topic/content/",
    showTopic: "/api/show/topic/",
    updateTopic: "/api/update/topic/",
    slugChecking: "/api/topic/article/",
    topicArticleSlug: "/api/topic/article/slug",

    ///quiz
    allQuiz: "/api/quizzes",
    addQuiz: "/api/add/quiz",
    deleteQuiz: "/api/delete/quiz/",
    showQuiz: "/api/show/quiz/",
    updateQuiz: "/api/update/quiz/",

    /// level
    allLevel: "/api/levels",
    addLevel: "/api/add/level",
    deleteLevel: "/api/delete/level/",
    showLevel: "/api/show/level/",
    updateLevel: "/api/update/level/",

    ///question
    allQuestion: "/api/questions",
    addQuestion: "/api/add/question",
    deleteQuestion: "/api/delete/question/",
    showQuestion: "/api/show/question/",
    updateQuestion: "/api/update/question/",
    LevelTopic: "/api/topic/level",

    ///attempt history
    attemptHistory: "/api/quiz/attemt/history/",
    reAttempt: "/api/quiz/reattempt/",

    //********* User ******//

    blog: "/api/user/articles",
    //catArticle: "/api/category/article/",

    //// blog
    // authBlog: "/api/auth/blog",
    // catBlog: "/api/cat/blog/",
    viewArticle: "/api/show/articles/",
    viewTopicArticle: "/api/view/topic/article/",
    ///course
    viewCourse: "/api/view/course/",
    viewQuiz: "/api/view/quiz/",
    quizAttempt: "/api/attempt",
    quizResult: "/api/quiz/result/",
    // quiz------
    quiz: "/api/quiz",
    results: "/api/quiz/result",
    //viewQuiz: "/api/view/quiz/",
    //viewQuestion: "/api/view/question/",



};

export const web = {
    createArticle: "/api/add/article",
    login: "/api/auth/login",
    allArticle: "/api/articles",
    editArticle: "/api/update/articles/",
    deleteArticle: "/api/delete/articles/",
    viewArticle: "/api/show/articles/",

    category: "/category",
};