import { program } from 'commander'
import packageJson from '../package.json'
import commands from './commands'

program
  .name(packageJson.name)
  .description(packageJson.description)

commands.forEach((command) => {
  command(program)
})

program.parse()
