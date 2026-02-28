(function (global) {
  function isLikelyMath(expr) {
    const trimmed = expr.trim();
    if (!trimmed) return false;
    if (/[\u4e00-\u9fff]/.test(trimmed)) return false;
    return /[A-Za-z\\^_=+\-*/{}\d]/.test(trimmed);
  }

  function convertInlineMath(line) {
    const pattern = /(^|[^\w\\])\(((?:[^()\n]+|\([^()\n]*\))+?)\)/g;
    return line.replace(pattern, (m, prefix, expr) => {
      if (!isLikelyMath(expr) || expr.includes('$')) return m;
      return `${prefix}( $${expr.trim()}$ )`;
    });
  }

  function normalizeMathBlocks(lines) {
    const out = [];
    let inBracketMath = false;
    let buffer = [];

    const flushBlock = () => {
      while (out.length && out[out.length - 1].trim() === '') out.pop();
      out.push('', '$$');
      buffer.forEach((l) => out.push(l.trim()));
      out.push('$$', '');
      buffer = [];
    };

    for (const raw of lines) {
      const line = raw;
      if (line.trim() === '[' && !inBracketMath) {
        inBracketMath = true;
        buffer = [];
        continue;
      }
      if (line.trim() === ']' && inBracketMath) {
        inBracketMath = false;
        flushBlock();
        continue;
      }
      if (inBracketMath) {
        buffer.push(line);
      } else {
        out.push(line);
      }
    }

    if (inBracketMath && buffer.length) {
      flushBlock();
    }

    return out;
  }

  function convertToFeishuMarkdown(input) {
    const normalized = input.replace(/\r\n?/g, '\n');
    const lines = normalized.split('\n').map((line) => line.replace(/^\*\s+/u, '- '));

    const normalizedBlocks = normalizeMathBlocks(lines);
    let inMathBlock = false;
    let out = normalizedBlocks.map((line) => {
      if (line.trim() === '$$') {
        inMathBlock = !inMathBlock;
        return line;
      }
      return inMathBlock ? line : convertInlineMath(line);
    });

    // collapse 2+ blank lines
    const collapsed = [];
    for (const line of out) {
      if (line.trim() === '' && collapsed.length >= 1 && collapsed[collapsed.length - 1] === '') {
        continue;
      }
      collapsed.push(line);
    }

    return collapsed.join('\n').trim() + '\n';
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertToFeishuMarkdown };
  } else {
    global.convertToFeishuMarkdown = convertToFeishuMarkdown;
  }
})(typeof window !== 'undefined' ? window : globalThis);
