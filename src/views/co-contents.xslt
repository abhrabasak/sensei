<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:foo="http://www.foo.org/" xmlns:bar="http://www.bar.org">
    <xsl:template match="co-content">
{
    "Anchors": [<xsl:for-each select="text/a">
        {
            "ID": "<xsl:value-of select="text()"/>",
            "Link": "<xsl:value-of select="@href"/>"
        }</xsl:for-each><xsl:if test="position() != last()"><xsl:text>,</xsl:text></xsl:if>
    ],
    "Assets": [<xsl:for-each select="asset">
        {
            "ID": "<xsl:value-of select="@id"/>",
            "Name": "<xsl:value-of select="@name"/>"
            "Extension": "<xsl:value-of select="@extension"/>"
        }</xsl:for-each><xsl:if test="position() != last()"><xsl:text>,</xsl:text></xsl:if>
    ]
}
    </xsl:template>
</xsl:stylesheet>
