import { useSettingsStore } from '@/stores/settings.store';

const DEFAULT_TITLE = 'Workflow Automation';

export function useDocumentTitle() {
	const settingsStore = useSettingsStore();
	const { releaseChannel } = settingsStore.settings;
	const suffix =
		!releaseChannel || releaseChannel === 'stable' ? 'mage' : `mage[${releaseChannel.toUpperCase()}]`;

	const set = (title: string) => {
		const sections = [title || DEFAULT_TITLE, suffix];
		document.title = sections.join(' - ');
	};

	const reset = () => {
		set('');
	};

	return { set, reset };
}
