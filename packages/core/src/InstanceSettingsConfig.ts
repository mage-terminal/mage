import { Config, Env } from '@mage/config';
import path from 'node:path';

@Config
export class InstanceSettingsConfig {
	/**
	 * Whether to enforce that mage settings file doesn't have overly wide permissions.
	 * If set to true, mage will check the permissions of the settings file and
	 * attempt change them to 0600 (only owner has rw access) if they are too wide.
	 */
	@Env('mage_ENFORCE_SETTINGS_FILE_PERMISSIONS')
	enforceSettingsFilePermissions: boolean = false;

	/**
	 * The home folder path of the user.
	 * If none can be found it falls back to the current working directory
	 */
	readonly userHome: string;

	readonly mageFolder: string;

	constructor() {
		const homeVarName = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
		this.userHome = process.env.mage_USER_FOLDER ?? process.env[homeVarName] ?? process.cwd();

		this.mageFolder = path.join(this.userHome, '.mage');
	}
}
