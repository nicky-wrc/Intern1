<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '*2%gAg7`yHNo}}C<9Hr0:YFYeENGRXDF,?e-v5eQ!S1DB 0?`MR3EYS17uTIt]RT' );
define( 'SECURE_AUTH_KEY',   '?.w~guA3!G,G*P,?fa4/XCV-Nw_PX/5oCWun<>i|yeL3*;v4yJ&THa,` <YA@we4' );
define( 'LOGGED_IN_KEY',     'hy(qf?&PXit3(*iE/_}*]5C~iUjE.K,}kbJ*uL{P_(,[(yCr^?vk!@#{cg R@YHJ' );
define( 'NONCE_KEY',         'i~Rt[PN}qUYI~HLw&&5x`Q~f,NNdfV.mJ$$%Y.XTE60:J29jF(!Q<o)L+k>Awu!O' );
define( 'AUTH_SALT',         'i: S}B.BUQaYRwrjuQRbb9N[-[~i$VWvNsE)PI,m$5`fUI,^^G&W q vPP~:>l$s' );
define( 'SECURE_AUTH_SALT',  'ib&!s$l~p(jVs_#%L:-Ufpd-aqqN3-Wyf~5X{}e%[n][Gd5s~v:wQ_hDmsVMj?jq' );
define( 'LOGGED_IN_SALT',    'Z[${uS2>m$[<lCONv:); nM$DKM! ZBsPM`E-},?Ux9+_bfLTuCtcyK}k*Lo]|w#' );
define( 'NONCE_SALT',        '3%snJ4n}g^tT+mZ=,W7/*b8 9qY[ar9ZK[ofcMm,yD<Ux<(JoYnu@/dB#;:=s6.B' );
define( 'WP_CACHE_KEY_SALT', 'kmzXv>O;_$`?iqT ]<})rOw.esHTR1:%}Bfi;*AC_FtSV}J8_^r`YgGgJgFVc&RI' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
