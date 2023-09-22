# How to contribute
> ⚠️ Every contributor needs to use Git and install Git-LFS extension. Read section
> [Git-LFS](#git-lfs) for more information.

The repository hosts an internal project of Norispace. Only allowed members can
contribute. This project follows main and feature branch scheme to accept
contributions. The procedure is following

1. Create a new feature branch

2. Make changes and commit them

3. File a pull request (PR)


Note that forking is omitted unlike the common procedure to contribute to open-source
software because this project is not a public repo yet. Contributors are free to create
and push a new branch to this remote for easy iteration of review process.


## How to make a commit
If you are not familiar with contributing to Git projects, please read [this
excerpt](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
[(한국어)](https://git-scm.com/book/ko/v2/%EB%B6%84%EC%82%B0-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C%EC%9D%98-Git-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-%EA%B8%B0%EC%97%AC%ED%95%98%EA%B8%B0)
first.

- Respect commit title and body convention

    In title, try 50 chars in English and use verb first in the imperative. Writing body
    is higly encouraged. Explain what you did in plain language. Body can be written in
    Korean.

- Check and remove whitespaces

    Use your editor or IDE to clear whitespaces. Or use a tool like
    [pre-commit](https://pre-commit.com/).

- Review what you are committing

    Avoid committing cache files or large files by mistakes. Feel free to update
    `.gitignore` file.


## Git-LFS
Git LFS is an Git extension to track large blobs or binary files, that are not suitable
for Git to work with. Follow the link (https://git-lfs.com/) to install the extension.

**tl;dr**
1. Install Git-LFS extension (per user)

    `git lfs install`

2. Add (`git add`) a blob and see if it is tracked properly (`git status -v` or `git
   diff --cached`) by lfs extension

    ```bash
    # 1. add the blob
    $ git add blob.jpg

    # 2. check if it is tracked by lfs
    # You should see something like below, which indicates lfs will track this file.
    #   version https://git-lfs.github.com/spec/v1
    #   oid sha256:cb7b3b27e5cfff2e64c15e2172bb46ba35e542ac4b66043726b8de449144f8f9
    #   size 268721
    $ git status -v

    # 2'. or use diff
    $ git diff --cached

    # 3. (optional) if you do not see lfs msg like above, first check if lfs extension
    # was installed correctly. Next, check the `.gitattributes` file to see what file
    # extensions are listed to use lfs. Feel free to add more to the list.
    # this example let lfs tracks .pdf files.
    $ git track "*.pdf"
    ```

3. Commit if everything looks fine


## How to open a PR
For the moment, it is not required to file an issue for a PR. Make a PR whenever you
feel suited. There is no template nor tag. Choose a concise title that represents your
PR well and describe the changes in the body.
