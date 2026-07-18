import js from "@eslint/js";

export default [
	{
		// lib/ and dev/lib/ are rollup build output (bundled/minified
		// third-party + generated code), not hand-written project source -
		// don't lint it even if someone runs `eslint .` instead of the
		// `npm run lint` script (which already scopes to src/).
		ignores: ["lib/**", "dev/**"]
	},
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2025,
			sourceType: "module",
			globals: {
				console: "readonly",
			}
		},
		rules: {
			"linebreak-style": [
				"error",
				"unix"
			],
			"quotes": [
				"error",
				"double"
			],
			"semi": [
				"error",
				"always"
			],
			"no-console": [
				"warn"
			]
		}
	}
];
