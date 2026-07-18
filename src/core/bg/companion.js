/*
 * Copyright 2010-2020 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of SingleFile.
 *
 *   The code in this file is free software: you can redistribute it and/or 
 *   modify it under the terms of the GNU Affero General Public License 
 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
 *   of the License, or (at your option) any later version.
 * 
 *   The code in this file is distributed in the hope that it will be useful, 
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
 *   General Public License for more details.
 *
 *   As additional permission under GNU AGPL version 3 section 7, you may 
 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
 *   AGPL normally required by section 4, provided you include this license 
 *   notice and a URL through which recipients can access the Corresponding 
 *   Source.
 */

/* global browser */

let enabled = true;

export {
	enabled,
	onMessage,
	externalSave,
	save
};

async function onMessage(message) {
	if (message.method.endsWith(".state")) {
		return { enabled };
	}
}

async function externalSave(pageData) {
	pageData.autoSaveExternalSave = false;
	let response;
	try {
		response = await browser.runtime.sendNativeMessage("singlefile_companion", {
			method: "externalSave",
			pageData
		});
	} catch (error) {
		// DEBUG: sendNativeMessage only reports success/failure via this
		// error's .message text - log the raw error and whether the
		// "Native host has exited" tolerance below actually matched it, so a
		// misleading "unexpected error" banner can be traced back to what
		// the browser/OS actually said instead of guessing.
		console.error("SingleFile debug (Companion externalSave): sendNativeMessage rejected -", error, "- tolerated as clean exit:", Boolean(error.message && error.message.includes("Native host has exited"))); // eslint-disable-line no-console
		if (!error.message || !error.message.includes("Native host has exited")) {
			throw error;
		}
	}
	if (response && response.error) {
		console.error("SingleFile debug (Companion externalSave): host responded with an error -", response.error); // eslint-disable-line no-console
		throw new Error(response.error + " (Companion)");
	}
}

async function save(pageData) {
	let response;
	try {
		response = await browser.runtime.sendNativeMessage("singlefile_companion", {
			method: "save",
			pageData
		});
	} catch (error) {
		// DEBUG: see comment in externalSave() above - same reasoning.
		console.error("SingleFile debug (Companion save): sendNativeMessage rejected -", error, "- tolerated as clean exit:", Boolean(error.message && error.message.includes("Native host has exited"))); // eslint-disable-line no-console
		if (!error.message || !error.message.includes("Native host has exited")) {
			throw error;
		}
	}
	if (response && response.error) {
		console.error("SingleFile debug (Companion save): host responded with an error -", response.error); // eslint-disable-line no-console
		throw new Error(response.error + " (Companion)");
	}
}