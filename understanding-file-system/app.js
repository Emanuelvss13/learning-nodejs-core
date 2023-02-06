const fs = require('fs/promises');

(async () => {
  
  // commands...
  const CREATE_FILE = 'create a file'
  const DELETE_FILE = 'delete the file'
  const RENAME_FILE = 'rename the file'
  const ADD_TO_FILE = 'add to the file'

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r")
      existingFileHandle.close();
      return console.log(`The file ${path} already exists.`);
    } catch (error) {
      const newFileHandle = await fs.open(path, "w")
      newFileHandle.close()
      console.log("A new file was successfully created");
    }
  }

  const deleteFile = async (path) => {
    try {
      await fs.rm(path)
    } catch (error) {
      if(error.code === "EEXIST") {
        console.log("This file not exists!");
      } else {
        console.log(error);
      }
    }
  }

  const renameFile = async (path, newPath) => {
    try {
      const fileHandler = await fs.open(path, "r")
      fileHandler.close()
      await fs.rename(path, newPath)
    } catch (error) {
      if(error.code === "EEXIST") {
        console.log("This file not exists!");
      } else {
        console.log(error);
      }
    }
  }

  const addTofile = async (path, content) => {
    try {
      const fileHandler = await fs.open(path, "wx")
  
      await fileHandler.writeFile(content)
  
      fileHandler.close()
    } catch (error) {
      if(error.code === "EEXIST") {
        console.log("This file not exists!");
      } else {
        console.log(error);
      }
    }
  }

  const commandFileHandler = await fs.open("./command.txt", "r")

  commandFileHandler.on("change", async () => {
      const buffer = Buffer.alloc((await commandFileHandler.stat()).size)
      const offset = 0
      const length= buffer.byteLength
      const position = 0

      await commandFileHandler.read(buffer, offset, length, position)

      const command = buffer.toString();

      if(command.includes(CREATE_FILE)) {
        const path = command.substring(CREATE_FILE.length + 1)
        createFile(path)
      }

      if(command.includes(DELETE_FILE)) {
        const path = command.substring(DELETE_FILE.length + 1)

        deleteFile(path)
      }

      if(command.includes(RENAME_FILE)) {
        const _idx = command.indexOf(" to ")
        const path = command.substring(RENAME_FILE.length + 1, _idx)
        const newName = command.substring(_idx + 4)

        renameFile(path, newName)
      }

      if(command.includes(ADD_TO_FILE)) {
        const _idx = command.indexOf(" this content: ")
        const path = command.substring(ADD_TO_FILE.length + 1, _idx)
        const content = command.substring(_idx + 15)

        addTofile(path, content)
      }
  })


  // watcher...
  const watcher = fs.watch('./command.txt')

  for await (const event of watcher) {
    if(event.eventType === "change") {
      commandFileHandler.emit("change")
    }
  }
})();