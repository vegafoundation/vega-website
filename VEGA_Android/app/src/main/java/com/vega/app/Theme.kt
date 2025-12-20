package com.vega.app

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val VegaColors = darkColorScheme()

@Composable
fun VegaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = VegaColors,
        typography = MaterialTheme.typography,
        content = content
    )
}
